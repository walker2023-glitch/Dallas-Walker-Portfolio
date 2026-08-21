"use client";

import { useState } from "react";
import { ResumeModal } from "@/components/ui/ResumeModal";

/**
 * Persistent resume affordance, rendered site-wide via `NavShell`.
 *
 * Previously a direct download button wired to a single `site.resumeUrl`.
 * Now it's the trigger for the ResumeModal: clicking `FETCH_RESUME.PDF` opens
 * a picker of four resume variants (General / AI / Software Dev / Data
 * Science). Per-variant availability (and the null-safe "not yet available"
 * state) is handled inside the modal, so this button is always actionable.
 */
export function ResumeFab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="fixed z-40 bottom-20 lg:bottom-6 right-4 md:right-6 flex items-center gap-2 px-4 py-2.5 font-ui-utility text-ui-utility uppercase border bg-primary text-on-primary border-primary shadow-lg hover:opacity-90 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[18px]" aria-hidden>
          download
        </span>
        Fetch_Resume.pdf
      </button>

      {isOpen ? <ResumeModal onClose={() => setIsOpen(false)} /> : null}
    </>
  );
}
