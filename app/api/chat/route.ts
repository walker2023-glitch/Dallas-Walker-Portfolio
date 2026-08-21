import { NextResponse, type NextRequest } from "next/server";
import { buildHostedSystemPrompt, buildLocalHandoffMessage } from "@/lib/aiContext";
import { getQuota, consumeQuota, QUOTA_WINDOW_SECONDS } from "@/lib/quota";
import { rateLimit } from "@/lib/rateLimit";
import { generateGeminiReply, getGeminiApiKey } from "@/lib/geminiChat";
import { site } from "@/config/site";

/**
 * POST /api/chat — hosted half of the hybrid AI assistant (plan §9, §11).
 *
 * Contract (per §9): `{ message, history? }` ->
 *   `{ reply, remainingFreeMessages, mode: "hosted" | "local-handoff", error? }`.
 *
 * - Calls Gemini 3.5 Flash server-side ONLY (API key never sent to the client).
 *   System prompt is built from the real `data/*.ts` files via
 *   `buildHostedSystemPrompt()`.
 * - Enforces a 3-free-question quota server-side (FR-6) via session cookie +
 *   Upstash/Vercel KV — NOT localStorage.
 * - Once quota is spent, returns `mode: "local-handoff"` with a handoff message
 *   and does NOT call Gemini again for that session.
 * - Fails gracefully on missing key / API error / timeout (§6): never a hard
 *   crash, and a failed call does NOT consume the visitor's quota.
 */

const MAX_TOKENS = 1024;
const MESSAGE_MAX_LEN = 2000;
const HISTORY_MAX_MESSAGES = 8;
const HISTORY_ITEM_MAX_LEN = 4000;
const REQUEST_TIMEOUT_MS = 30_000;
const IP_RATE_LIMIT = { limit: 30, windowMs: 10 * 60 * 1000 };

const SESSION_COOKIE = "dw_chat_session";

type ChatRole = "user" | "assistant";
interface ChatMessage {
  role: ChatRole;
  content: string;
}

function sanitizeHistory(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];

  const cleaned: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { role, content } = item as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const trimmed = content.trim();
    if (!trimmed) continue;
    cleaned.push({ role, content: trimmed.slice(0, HISTORY_ITEM_MAX_LEN) });
  }

  const alternating: ChatMessage[] = [];
  for (const msg of cleaned) {
    if (alternating.length === 0) {
      if (msg.role !== "user") continue;
      alternating.push(msg);
    } else if (alternating[alternating.length - 1].role === msg.role) {
      alternating[alternating.length - 1] = msg;
    } else {
      alternating.push(msg);
    }
  }
  if (alternating.length > 0 && alternating[alternating.length - 1].role === "user") {
    alternating.pop();
  }

  return alternating.slice(-HISTORY_MAX_MESSAGES);
}

function getOrCreateSessionId(request: NextRequest): { id: string; isNew: boolean } {
  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  if (existing && /^[a-zA-Z0-9-]{8,64}$/.test(existing)) {
    return { id: existing, isNew: false };
  }
  return { id: crypto.randomUUID(), isNew: true };
}

function withSessionCookie(response: NextResponse, sessionId: string, isNew: boolean) {
  if (isNew) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: QUOTA_WINDOW_SECONDS,
    });
  }
  return response;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(`chat:${ip}`, IP_RATE_LIMIT).allowed) {
    return NextResponse.json(
      {
        reply: "",
        remainingFreeMessages: 0,
        mode: "hosted",
        error: "Too many requests. Please slow down and try again shortly.",
      },
      { status: 429 }
    );
  }

  const { id: sessionId, isNew } = getOrCreateSessionId(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return withSessionCookie(
      NextResponse.json(
        { reply: "", remainingFreeMessages: null, mode: "hosted", error: "Invalid request body." },
        { status: 400 }
      ),
      sessionId,
      isNew
    );
  }

  const { message, history } = (body ?? {}) as Record<string, unknown>;

  if (typeof message !== "string" || !message.trim()) {
    return withSessionCookie(
      NextResponse.json(
        { reply: "", remainingFreeMessages: null, mode: "hosted", error: "Message is required." },
        { status: 400 }
      ),
      sessionId,
      isNew
    );
  }
  if (message.length > MESSAGE_MAX_LEN) {
    return withSessionCookie(
      NextResponse.json(
        {
          reply: "",
          remainingFreeMessages: null,
          mode: "hosted",
          error: `Message is too long (max ${MESSAGE_MAX_LEN} characters).`,
        },
        { status: 400 }
      ),
      sessionId,
      isNew
    );
  }

  const quota = await getQuota(sessionId);
  if (quota.remaining <= 0) {
    return withSessionCookie(
      NextResponse.json({
        reply: buildLocalHandoffMessage(),
        remainingFreeMessages: 0,
        mode: "local-handoff",
      }),
      sessionId,
      isNew
    );
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.error("/api/chat: GEMINI_API_KEY (or NEXT_PUBLIC_GEMINI_API_KEY) is not set");
    return withSessionCookie(
      NextResponse.json(
        {
          reply: "",
          remainingFreeMessages: quota.remaining,
          mode: "hosted",
          error: `The hosted assistant isn't configured yet. You can still reach ${site.fullName} via the Contact page.`,
        },
        { status: 503 }
      ),
      sessionId,
      isNew
    );
  }

  const messages: ChatMessage[] = [
    ...sanitizeHistory(history),
    { role: "user", content: message.trim() },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const reply = await generateGeminiReply(
      apiKey,
      buildHostedSystemPrompt(),
      messages,
      { maxTokens: MAX_TOKENS, signal: controller.signal }
    );

    const updated = await consumeQuota(sessionId);

    return withSessionCookie(
      NextResponse.json({
        reply,
        remainingFreeMessages: updated.remaining,
        mode: "hosted",
      }),
      sessionId,
      isNew
    );
  } catch (error) {
    const isTimeout =
      controller.signal.aborted ||
      (error instanceof Error && error.name === "AbortError");
    const status = isTimeout ? 504 : 502;
    console.error("/api/chat: Gemini call failed", error);

    return withSessionCookie(
      NextResponse.json(
        {
          reply: "",
          remainingFreeMessages: quota.remaining,
          mode: "hosted",
          error: isTimeout
            ? "The assistant took too long to respond. Please try again."
            : "The assistant is temporarily unavailable. Please try again in a moment.",
        },
        { status }
      ),
      sessionId,
      isNew
    );
  } finally {
    clearTimeout(timeout);
  }
}
