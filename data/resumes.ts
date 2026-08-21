/**
 * Resume variants surfaced by the ResumeModal (`FETCH_RESUME.PDF`).
 *
 * This file owns the *display metadata* (name + one-line description) for each
 * variant. The download URLs come from `config/site.ts` (`site.resumeUrls`),
 * which is the single env-driven source of truth — so there's no duplicate
 * env read to keep in sync. A `null` url means "not yet available" and the
 * modal renders a disabled state instead of a broken link.
 *
 * Descriptions are written from the actual PDFs in `/public/resumes/` so they
 * accurately reflect how each variant is tailored.
 */

import { site, type ResumeVariantKey } from "@/config/site";

export interface ResumeVariant {
  /** Stable key, matches `site.resumeUrls` and the NEXT_PUBLIC_RESUME_* env var. */
  key: ResumeVariantKey;
  name: string;
  description: string;
  /** Material Symbols Outlined icon name for the variant. */
  icon: string;
  /** null = not yet available; the modal disables this variant's download. */
  url: string | null;
}

export const resumes: Record<ResumeVariantKey, ResumeVariant> = {
  general: {
    key: "general",
    name: "General",
    description:
      "Balanced overview across AI, data, and full-stack development — all core skills and projects.",
    icon: "description",
    url: site.resumeUrls.general,
  },
  ai: {
    key: "ai",
    name: "AI",
    description:
      "AI/ML focus — LLM evaluation frameworks, agentic workflows, prompt engineering, and ML classification.",
    icon: "smart_toy",
    url: site.resumeUrls.ai,
  },
  softwareDev: {
    key: "softwareDev",
    name: "Software Development",
    description:
      "Full-stack development focus — building and shipping apps, APIs, and cloud-deployed products.",
    icon: "code",
    url: site.resumeUrls.softwareDev,
  },
  dataScience: {
    key: "dataScience",
    name: "Data Science",
    description:
      "Data science focus — statistical modeling, experiment design/ANOVA, and ML data pipelines in R and Python.",
    icon: "analytics",
    url: site.resumeUrls.dataScience,
  },
};

/** Stable render order for the modal. */
export const resumeVariants: ResumeVariant[] = [
  resumes.general,
  resumes.ai,
  resumes.softwareDev,
  resumes.dataScience,
];
