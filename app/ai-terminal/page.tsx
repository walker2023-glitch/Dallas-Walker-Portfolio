import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { AiTerminal } from "@/components/ai/AiTerminal";

export const metadata: Metadata = {
  title: "AI Terminal",
  description:
    "Ask an AI assistant about Dallas Walker — hosted Gemini 3.5 Flash with an in-browser fallback model.",
};

/**
 * AI assistant route (plan §11).
 *
 * Placement decision (plan §18 item 5, was open): implemented as a dedicated
 * route — the same `/ai-terminal` node the sidebar has always pointed at —
 * rather than a persistent site-wide panel. Rationale: a full-height chat
 * surface reads better on its own page, keeps the heavy WebLLM fallback off
 * every other route, and needs zero changes to the nav shell. A persistent
 * panel could still be layered on later by mounting <AiTerminal /> in a
 * drawer, but that's out of scope here.
 */
export default function AiTerminalPage() {
  return (
    <>
      <PageHeader
        title="AI_Terminal"
        path="Directory://root/opt/ai/terminal.sys"
        eyebrow="[MODULE_ID: 07]"
      />
      <AiTerminal />
    </>
  );
}
