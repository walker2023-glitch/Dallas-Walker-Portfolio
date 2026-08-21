import { site } from "@/config/site";

/**
 * Site footer, per the Stitch mockup (Rough Draft lines 2462-2475 / 3958-3968).
 * Consumes real GitHub / LinkedIn URLs from `config/site.ts` — this is where
 * FR-10 lands as of Phase 1.
 *
 * The copyright year is dynamic; brand is Dallas's, not the mockup's
 * placeholder "CORE_ARCHIVE".
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant">
      <div className="mx-auto max-w-container-max flex flex-col md:flex-row justify-between items-center gap-4 px-margin-mobile md:px-margin-desktop py-4">
        <div className="flex items-center gap-4">
          <span className="font-ui-utility text-ui-utility uppercase text-on-surface">
            {site.fullName}
          </span>
          <span className="h-4 w-px bg-outline-variant" aria-hidden />
          <p className="font-code-label text-code-label text-outline uppercase">
            © {year} All Rights Reserved.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-code-label text-code-label text-tertiary hover:text-primary underline underline-offset-4 transition-colors"
          >
            GITHUB
          </a>
          <a
            href={site.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-code-label text-code-label text-tertiary hover:text-primary underline underline-offset-4 transition-colors"
          >
            LINKEDIN
          </a>
          <span
            className="font-code-label text-code-label text-primary"
            aria-live="polite"
          >
            SYSTEM_STATUS: ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
}
