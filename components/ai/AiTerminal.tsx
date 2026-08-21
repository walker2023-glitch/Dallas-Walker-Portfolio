"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  FREE_QUESTION_LIMIT,
  FALLBACK_MODEL_LABEL,
  buildFallbackSystemPrompt,
} from "@/lib/aiContext";
import {
  isFallbackSupported,
  loadFallbackEngine,
  generateFallbackReply,
  type FallbackEngine,
  type ChatTurn,
} from "@/lib/fallbackModel";
import { site } from "@/config/site";

type Source = "hosted" | "local" | "system";
interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  source: Source;
}

type Mode = "hosted" | "local";
type Status = "idle" | "sending" | "loading-model" | "thinking-local";

const SUGGESTIONS = [
  "What are Dallas's strongest technical skills?",
  "Tell me about the N-sight project.",
  "What's his education background?",
];

function uid() {
  return Math.random().toString(36).slice(2);
}

export function AiTerminal() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<Mode>("hosted");
  const [remaining, setRemaining] = useState<number>(FREE_QUESTION_LIMIT);
  const [modelProgress, setModelProgress] = useState<{ progress: number; text: string } | null>(null);
  const [fallbackReady, setFallbackReady] = useState(false);
  const [webgpuSupported, setWebgpuSupported] = useState<boolean | null>(null);

  const engineRef = useRef<FallbackEngine | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setWebgpuSupported(isFallbackSupported());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status, modelProgress]);

  const busy = status !== "idle";

  function appendMessage(msg: Omit<UiMessage, "id">) {
    setMessages((prev) => [...prev, { ...msg, id: uid() }]);
  }

  /** Build hosted history from the visible transcript (facts-only turns). */
  function buildHistory() {
    return messages
      .filter((m) => m.source === "hosted" || m.source === "local" || m.role === "user")
      .map((m) => ({ role: m.role, content: m.content }));
  }

  async function ensureEngine(): Promise<FallbackEngine | null> {
    if (engineRef.current) return engineRef.current;
    if (!isFallbackSupported()) return null;

    setStatus("loading-model");
    setModelProgress({ progress: 0, text: "Preparing in-browser model…" });
    try {
      const engine = await loadFallbackEngine((info) => setModelProgress(info));
      engineRef.current = engine;
      setFallbackReady(true);
      return engine;
    } catch {
      appendMessage({
        role: "assistant",
        source: "system",
        content:
          "The in-browser model failed to load. You can still reach out directly via the Contact page.",
      });
      return null;
    } finally {
      setModelProgress(null);
    }
  }

  async function answerLocally(question: string, history: ChatTurn[]) {
    const engine = await ensureEngine();
    if (!engine) {
      setStatus("idle");
      return;
    }
    setStatus("thinking-local");
    try {
      // The local model has a small context window and the system prompt
      // already carries every fact, so keep only the last couple of turns.
      const turns: ChatTurn[] = [
        { role: "system", content: buildFallbackSystemPrompt() },
        ...history.slice(-4),
        { role: "user", content: question },
      ];
      const reply = await generateFallbackReply(engine, turns);
      appendMessage({ role: "assistant", source: "local", content: reply });
    } catch {
      appendMessage({
        role: "assistant",
        source: "system",
        content: "The in-browser model hit an error. Please try again, or use the Contact page.",
      });
    } finally {
      setStatus("idle");
    }
  }

  async function sendHosted(question: string) {
    const history = buildHistory();
    setStatus("sending");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });
      const data = (await res.json()) as {
        reply: string;
        remainingFreeMessages: number | null;
        mode: "hosted" | "local-handoff";
        error?: string;
      };

      if (typeof data.remainingFreeMessages === "number") {
        setRemaining(data.remainingFreeMessages);
      }

      if (data.mode === "local-handoff") {
        setMode("local");
        appendMessage({
          role: "assistant",
          source: "system",
          content: isFallbackSupported()
            ? `You've used your ${FREE_QUESTION_LIMIT} free hosted questions. Switching to a private, in-browser model (${FALLBACK_MODEL_LABEL}) — it downloads once on first use, then runs entirely on your device.`
            : `You've used your ${FREE_QUESTION_LIMIT} free hosted questions, and this browser doesn't support the in-browser fallback (no WebGPU). Please reach out via the Contact page or email ${site.email}.`,
        });
        setStatus("idle");
        // Route the just-asked question to the local model.
        await answerLocally(question, history as ChatTurn[]);
        return;
      }

      if (data.error || !data.reply) {
        appendMessage({
          role: "assistant",
          source: "system",
          content: data.error || "Something went wrong. Please try again.",
        });
        setStatus("idle");
        return;
      }

      appendMessage({ role: "assistant", source: "hosted", content: data.reply });
      setStatus("idle");
    } catch {
      appendMessage({
        role: "assistant",
        source: "system",
        content: "Network error reaching the assistant. Please try again.",
      });
      setStatus("idle");
    }
  }

  async function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed || busy) return;
    setInput("");
    appendMessage({ role: "user", source: mode === "hosted" ? "hosted" : "local", content: trimmed });

    if (mode === "hosted") {
      await sendHosted(trimmed);
    } else {
      await answerLocally(trimmed, buildHistory() as ChatTurn[]);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(input);
  }

  return (
    <div className="glass-panel border border-outline-variant flex flex-col h-[70vh] min-h-[480px]">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-code-label text-code-label text-primary uppercase">
            {mode === "hosted" ? "Hosted_Core // Claude Haiku 4.5" : `Local_Core // ${FALLBACK_MODEL_LABEL}`}
          </span>
        </div>
        <span className="font-code-label text-[10px] text-outline uppercase">
          {mode === "hosted" ? `Free_Q: ${remaining}/${FREE_QUESTION_LIMIT}` : "On-Device"}
        </span>
      </div>

      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        {messages.length === 0 ? (
          <div className="text-on-surface-variant">
            <p className="font-body-sm mb-4">
              Ask about {site.fullName}&apos;s projects, experience, skills, or education. The first{" "}
              {FREE_QUESTION_LIMIT} questions use the hosted Claude model; after that it hands off to a
              private in-browser model.
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void submit(s)}
                  className="border border-outline-variant px-3 py-1.5 font-code-label text-[11px] text-on-surface-variant hover:border-primary hover:text-primary transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((m) => (
          <div key={m.id} className="flex flex-col gap-1">
            <span
              className={`font-code-label text-[10px] uppercase ${
                m.role === "user"
                  ? "text-tertiary"
                  : m.source === "system"
                    ? "text-error"
                    : "text-primary"
              }`}
            >
              {m.role === "user"
                ? "> USER"
                : m.source === "local"
                  ? "> AI [LOCAL]"
                  : m.source === "system"
                    ? "> SYSTEM"
                    : "> AI"}
            </span>
            <p
              className={`font-body-base whitespace-pre-wrap leading-relaxed ${
                m.role === "user" ? "text-on-surface" : "text-on-surface-variant"
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}

        {status === "sending" ? (
          <p className="font-code-label text-code-label text-outline animate-pulse">
            &gt; AI is thinking…
          </p>
        ) : null}
        {status === "thinking-local" ? (
          <p className="font-code-label text-code-label text-outline animate-pulse">
            &gt; AI [LOCAL] is thinking… (runs on your device, may be slower)
          </p>
        ) : null}
        {status === "loading-model" && modelProgress ? (
          <div className="space-y-1">
            <p className="font-code-label text-[10px] text-outline uppercase">
              Loading {FALLBACK_MODEL_LABEL} — {Math.round(modelProgress.progress * 100)}%
            </p>
            <div className="w-full h-1 bg-surface-variant">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.max(2, Math.round(modelProgress.progress * 100))}%` }}
              />
            </div>
            <p className="font-code-label text-[10px] text-outline break-all">{modelProgress.text}</p>
          </div>
        ) : null}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-outline-variant p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          maxLength={2000}
          aria-label="Message the assistant"
          placeholder={
            mode === "local" && !fallbackReady && webgpuSupported === false
              ? "In-browser model unavailable — use the Contact page"
              : "Ask a question…"
          }
          className="flex-1 bg-[#050505] border border-outline-variant focus:border-primary text-on-surface px-4 py-3 font-ui-utility text-body-base outline-none transition-all disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="px-5 bg-primary text-on-primary font-ui-utility text-ui-utility uppercase tracking-widest transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden>
            send
          </span>
          Send
        </button>
      </form>
    </div>
  );
}
