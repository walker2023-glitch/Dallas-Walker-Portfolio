/**
 * Server-side Gemini generateContent helper for `/api/chat`.
 *
 * Uses the REST API directly (no extra SDK) so the API key stays in the
 * Route Handler only. Model: gemini-3.5-flash.
 */

export const GEMINI_HOSTED_MODEL_ID = "gemini-3.5-flash";

export interface GeminiChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

/**
 * Prefer `GEMINI_API_KEY` (server-only). Also accepts `NEXT_PUBLIC_GEMINI_API_KEY`
 * when set only in server env (e.g. Vercel) — never import this module from
 * client components.
 */
export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;
}

export async function generateGeminiReply(
  apiKey: string,
  systemPrompt: string,
  messages: GeminiChatTurn[],
  options?: { maxTokens?: number; signal?: AbortSignal }
): Promise<string> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_HOSTED_MODEL_ID}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: options?.maxTokens ?? 1024,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
      signal: options?.signal,
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errBody.slice(0, 500)}`);
  }

  const data = (await res.json()) as GeminiGenerateResponse;
  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Empty completion from Gemini");
  }

  return text;
}
