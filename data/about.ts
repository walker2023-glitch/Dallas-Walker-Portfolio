/**
 * About directory — typed source of truth for the About page (FR-15,
 * plan §18 item 2).
 *
 * Content provenance: the profile blurb and education block are
 * transcribed verbatim from docs/plan/portfolio-v2.md Appendix A. Per the
 * plan's own note, the profile blurb is the same copy already used on the
 * current site's hero section — reused here rather than rewritten.
 *
 * Deliberately no "mission statement" or "core values" copy: the Stitch
 * mockup's About page includes both, but Appendix A supplies neither, and
 * inventing them would violate the plan's "no fabricated content" rule.
 * Add real fields here if/when the owner supplies that content.
 */

export const profileBlurb =
  "Problem-solver with a multidisciplinary background in Computer Science and advanced Statistics, dedicated to leveraging diverse mathematical and programmatic tools for AI development. Having worked in multicultural environments like Hong Kong, I bring a resilient, service-first mindset to solving the world's most difficult computational problems.";

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  status: string;
  gpa: string;
  awards: string[];
}

export const education: EducationEntry = {
  degree: "B.S. Computer Science & Statistics (double major)",
  institution: "Brigham Young University–Idaho",
  location: "Rexburg, ID",
  status: "Expected Fall 2028",
  gpa: "4.0 / 4.0",
  awards: [
    "CTE Presidential Scholar",
    "Eagle Scout Award Recipient",
    "Full-Tuition Academic Scholarship",
    "TestOut PC Prep Certificate",
  ],
};
