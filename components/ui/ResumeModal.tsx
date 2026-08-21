"use client";

import { useEffect, useRef } from "react";
import { resumeVariants } from "@/data/resumes";

/**
 * Resume variant picker modal, opened from the `FETCH_RESUME.PDF` FAB.
 *
 * Follows the same overlay/card pattern as `ProjectModal` (Phase 2) for
 * visual + interaction consistency: dark blurred overlay, bordered
 * `surface-container` card, Escape-to-close, click-outside-to-close, and
 * initial focus on the close button.
 *
 * Each of the four variants renders a download row. When a variant's `url`
 * is null it shows a disabled "NOT_YET_AVAILABLE" state rather than a broken
 * link (mirrors the site-wide null-safe resume/repo convention).
 */
export function ResumeModal({ onClose }: { onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        role="presentation"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto bg-surface-container border border-primary/40"
      >
        <div className="flex items-center justify-between p-5 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px]" aria-hidden>
              picture_as_pdf
            </span>
            <div>
              <h2
                id="resume-modal-title"
                className="font-title-sm text-title-sm text-on-surface uppercase"
              >
                Fetch_Resume.pdf
              </h2>
              <p className="font-code-label text-[10px] text-outline uppercase mt-0.5">
                Select_Variant // 04_Available
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close resume picker"
            className="w-8 h-8 flex items-center justify-center bg-surface-dim/90 border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <ul className="p-5 space-y-3">
          {resumeVariants.map((variant) => (
            <li key={variant.key}>
              {variant.url ? (
                <a
                  href={variant.url}
                  download
                  className="group flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant hover:border-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-[24px]" aria-hidden>
                    {variant.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-title-sm text-body-base text-on-surface font-semibold group-hover:text-primary transition-colors">
                      {variant.name}
                    </p>
                    <p className="font-body-sm text-on-surface-variant leading-snug mt-0.5">
                      {variant.description}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 shrink-0 bg-primary text-on-primary px-3 py-2 font-ui-utility text-ui-utility uppercase">
                    <span className="material-symbols-outlined text-[18px]" aria-hidden>
                      download
                    </span>
                    Get
                  </span>
                </a>
              ) : (
                <div
                  aria-disabled="true"
                  title="This resume variant is not yet available."
                  className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant opacity-60 cursor-not-allowed"
                >
                  <span
                    className="material-symbols-outlined text-outline text-[24px]"
                    aria-hidden
                  >
                    {variant.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-title-sm text-body-base text-on-surface-variant font-semibold">
                      {variant.name}
                    </p>
                    <p className="font-body-sm text-outline leading-snug mt-0.5">
                      {variant.description}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 shrink-0 border border-outline-variant text-outline px-3 py-2 font-code-label text-[10px] uppercase">
                    <span className="material-symbols-outlined text-[16px]" aria-hidden>
                      hourglass_top
                    </span>
                    Soon
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>

        <p className="px-5 pb-5 font-code-label text-[10px] text-outline uppercase">
          [ESC] to close · Downloads are direct PDF fetches
        </p>
      </div>
    </div>
  );
}
