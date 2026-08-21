/**
 * Client-side fallback model wrapper (FR-7) — WebLLM, lazy-loaded.
 *
 * The heavy `@mlc-ai/web-llm` dependency is imported with a dynamic `import()`
 * INSIDE `loadFallbackEngine()`, which only runs after a visitor has spent
 * their 5 hosted questions and explicitly opts in. It is never part of the
 * initial page bundle (verified: no top-level import of the package here or
 * in any server-imported module).
 *
 * WebLLM needs WebGPU. `isFallbackSupported()` lets the UI degrade gracefully
 * (point the visitor to email/contact) instead of hard-failing on browsers
 * without it (§6).
 */

import { FALLBACK_MODEL_ID } from "@/lib/aiContext";

// Kept loose (no static WebLLM types) so this module never forces the package
// into the bundle graph until the dynamic import runs.
export type FallbackEngine = {
  chat: {
    completions: {
      create: (args: unknown) => Promise<unknown>;
    };
  };
};

export interface ChatTurn {
  role: "system" | "user" | "assistant";
  content: string;
}

/** WebGPU is required for WebLLM. */
export function isFallbackSupported(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

let enginePromise: Promise<FallbackEngine> | null = null;

/**
 * Lazily download + initialize the local model. Safe to call repeatedly — the
 * engine is created once and reused. `onProgress` reports download/init
 * progress (0..1 where known) plus a human-readable status string.
 */
export function loadFallbackEngine(
  onProgress?: (info: { progress: number; text: string }) => void
): Promise<FallbackEngine> {
  if (!enginePromise) {
    enginePromise = (async () => {
      const webllm = await import("@mlc-ai/web-llm");
      const engine = await webllm.CreateMLCEngine(FALLBACK_MODEL_ID, {
        initProgressCallback: (report: { progress: number; text: string }) => {
          onProgress?.({ progress: report.progress ?? 0, text: report.text ?? "" });
        },
      });
      return engine as unknown as FallbackEngine;
    })().catch((err) => {
      // Reset so a later attempt can retry from scratch.
      enginePromise = null;
      throw err;
    });
  }
  return enginePromise;
}

/**
 * Run one completion on the local model. Non-streaming for simplicity and to
 * mirror the hosted route's response shape.
 */
export async function generateFallbackReply(
  engine: FallbackEngine,
  messages: ChatTurn[]
): Promise<string> {
  const result = (await engine.chat.completions.create({
    messages,
    temperature: 0.3,
    max_tokens: 512,
  })) as { choices?: Array<{ message?: { content?: string } }> };

  const reply = result.choices?.[0]?.message?.content?.trim();
  return reply || "I don't have that information — please reach out via the Contact page.";
}
