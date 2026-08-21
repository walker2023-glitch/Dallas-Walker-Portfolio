/**
 * Central site configuration.
 *
 * All personal links, brand strings, and resume/contact endpoints live here so
 * the rest of the app can consume them without hardcoding. This is the single
 * seam FR-9 / FR-10 / FR-11 plug into.
 *
 * `resumeUrls` holds the four resume variants surfaced by the ResumeModal
 * (`FETCH_RESUME.PDF`). Each is env-driven so URLs can be swapped without a
 * code change (same pattern as the GitHub/LinkedIn links). A `null` value
 * renders a disabled "not yet available" state in the modal — never a broken
 * link. Because these are read client-side, the env vars MUST use the
 * `NEXT_PUBLIC_` prefix (they are inlined at build time and public by design —
 * only put URLs of already-public PDFs here).
 *
 * The 4 PDFs ship in `/public/resumes/`. Defaults point at those paths so
 * downloads work out of the box; override any variant with a NEXT_PUBLIC_*
 * env var (e.g. to host PDFs on a CDN) without a code change.
 */
export const site = {
  brand: "SYSTEM_CORE_V1.0",
  fullName: "Dallas Walker",
  tagline: "Portfolio",
  email: "dallaswalker1023@gmail.com",
  githubUrl: "https://github.com/walker2023-glitch",
  linkedInUrl: "https://linkedin.com/in/dallas-walker",
  resumeUrls: {
    general: process.env.NEXT_PUBLIC_RESUME_GENERAL || "/resumes/general.pdf",
    ai: process.env.NEXT_PUBLIC_RESUME_AI || "/resumes/ai.pdf",
    softwareDev:
      process.env.NEXT_PUBLIC_RESUME_SOFTWARE_DEV || "/resumes/software-development.pdf",
    dataScience:
      process.env.NEXT_PUBLIC_RESUME_DATA_SCIENCE || "/resumes/data-science.pdf",
  },
} as const;

export type SiteConfig = typeof site;
export type ResumeVariantKey = keyof typeof site.resumeUrls;
