import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildHostedSystemPrompt } from "@/lib/aiContext";
import { getQuota, consumeQuota, QUOTA_WINDOW_SECONDS } from "@/lib/quota";
import { rateLimit } from "@/lib/rateLimit";
import { site } from "@/config/site";

/**
 * POST /api/chat — hosted half of the hybrid AI assistant (plan §9, §11).
 *
 * Contract (per §9): `{ message, history? }` ->
 *   `{ reply, remainingFreeMessages, mode: "hosted" | "local-handoff", error? }`.
 *
 * - Calls Claude Haiku 4.5 server-side ONLY (the API key never reaches the
 *   client). System prompt is built from the real `data/*.ts` files via
 *   `buildHostedSystemPrompt()`.
 * - Enforces the 5-free-question quota server-side (FR-6) via a session
 *   cookie + KV/in-memory store — NOT localStorage.
 * - Once the quota is spent, returns `mode: "local-handoff"` WITHOUT calling
 *   Claude; the client then loads the in-browser fallback model (FR-7).
 * - Fails gracefully on missing key / API error / timeout (§6): never a hard
 *   crash, and a failed call does NOT consume the visitor's quota.
 */

const MODEL_ID = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1024;
const MESSAGE_MAX_LEN = 2000;
const HISTORY_MAX_MESSAGES = 8;
const HISTORY_ITEM_MAX_LEN = 4000;
const REQUEST_TIMEOUT_MS = 30_000;
const IP_RATE_LIMIT = { limit: 30, windowMs: 10 * 60 * 1000 }; // anti-hammer guard

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

  // The Anthropic API requires a strictly alternating sequence that starts
  // with "user". Enforce that here: drop leading assistant turns, collapse
  // consecutive same-role turns (keep the latest), and drop a trailing "user"
  // turn since the route appends the current user message right after.
  const alternating: ChatMessage[] = [];
  for (const msg of cleaned) {
    if (alternating.length === 0) {
      if (msg.role !== "user") continue; // must start with user
      alternating.push(msg);
    } else if (alternating[alternating.length - 1].role === msg.role) {
      alternating[alternating.length - 1] = msg; // collapse duplicate role
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

  // Quota check BEFORE spending an API call.
  const quota = await getQuota(sessionId);
  if (quota.remaining <= 0) {
    return withSessionCookie(
      NextResponse.json({
        reply: "",
        remainingFreeMessages: 0,
        mode: "local-handoff",
      }),
      sessionId,
      isNew
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("/api/chat: ANTHROPIC_API_KEY is not set");
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
    const client = new Anthropic({ apiKey });
    const completion = await client.messages.create(
      {
        model: MODEL_ID,
        max_tokens: MAX_TOKENS,
        system: buildHostedSystemPrompt(),
        messages,
      },
      { signal: controller.signal }
    );

    const reply = completion.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!reply) {
      throw new Error("Empty completion from model");
    }

    // Only now, on success, spend one question from the quota.
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
      (error instanceof Error && (error.name === "AbortError" || error.name === "APIUserAbortError"));
    const status = isTimeout ? 504 : 502;
    console.error("/api/chat: model call failed", error);

    return withSessionCookie(
      NextResponse.json(
        {
          reply: "",
          // Quota NOT consumed on failure — visitor keeps their question.
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
