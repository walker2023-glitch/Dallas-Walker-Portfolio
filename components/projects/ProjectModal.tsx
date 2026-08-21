"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * Project detail modal. Adapts the old site's repo-availability pattern
 * (`old_stuff/javascript.js` `setupModalInteractions`) to the new nullable
 * `repoUrl` field:
 *
 *   - `repoUrl` set    → a real "ACCESS_SECURE_REPOSITORY" link.
 *   - `repoUrl` null   → "[REPO_STATUS: CLASSIFIED_INTERNAL]", never a
 *                        broken or missing link (FR-9a, AC-9).
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        role="presentation"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-surface-container border border-primary/40"
      >
        <div className="project-image-frame bg-surface-container-lowest">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 768px) 42rem, 100vw"
            className="project-image"
          />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-surface-dim/90 border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          <span className="absolute bottom-3 left-3 bg-surface-dim/90 border border-outline-variant px-2 py-0.5 font-code-label text-[10px] text-primary uppercase">
            {project.tag}
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary text-[22px]" aria-hidden>
              {project.icon}
            </span>
            <h2
              id="project-modal-title"
              className="font-headline-md text-headline-md text-on-surface uppercase"
            >
              {project.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 mb-5 font-code-label text-[10px] uppercase">
            <span className="px-2 py-0.5 border border-outline-variant text-tertiary">
              {project.language}
            </span>
            <span className="px-2 py-0.5 border border-outline-variant text-outline">
              {project.complexity}
            </span>
            <span className="px-2 py-0.5 border border-outline-variant text-outline">
              {project.dateCompleted ?? "DATE: PENDING"}
            </span>
          </div>

          <p className="font-body-base text-on-surface-variant leading-relaxed mb-6">
            {project.longDesc}
          </p>

          <div className="pt-4 border-t border-outline-variant/40">
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 font-ui-utility text-ui-utility uppercase hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Access_Secure_Repository
              </a>
            ) : (
              <p className="font-code-label text-code-label text-outline uppercase flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]" aria-hidden>
                  lock
                </span>
                [REPO_STATUS: CLASSIFIED_INTERNAL]
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
