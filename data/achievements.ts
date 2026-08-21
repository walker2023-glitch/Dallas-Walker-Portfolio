/**
 * Achievements directory — typed source of truth for the Achievements page
 * (FR-8, FR-15).
 *
 * Content provenance: every entry is transcribed from the real resume
 * material in docs/plan/portfolio-v2.md Appendix A ("Achievements" section).
 * No content here comes from the Stitch mockup.
 *
 * `year` ships `null` for every entry: Appendix A does not supply a year for
 * any of these five achievements, and inventing one would violate the
 * plan's "no fabricated content" rule. Set a real value here once the owner
 * supplies it; the UI already handles the null case ("PENDING").
 *
 * `refCode` and `tier` are decorative-only, per FR-8 ("blockchain
 * verification" flavor text MAY stay as pure visual styling, but must not
 * claim to perform any real verification). They are stylized IDs/ranks
 * generated from the achievement's own real name — not an external
 * reference number or an actual verification result. The achievement
 * content itself (title + description) is 100% real.
 */

export type AchievementTier = "S-CLASS" | "A-CLASS" | "B-CLASS";

export interface Achievement {
  id: string;
  title: string;
  /** ISO year string, or null if not yet supplied by the owner. */
  year: string | null;
  /** Decorative flavor code only — see file header. Not an external reference. */
  refCode: string;
  description: string;
  tier: AchievementTier;
  /** Material Symbols Outlined icon name. */
  icon: string;
}

export const achievements: Achievement[] = [
  {
    id: "nsight-mda",
    title: 'N-sight — "Most Deployable Application"',
    year: null,
    refCode: "NSIGHT-MDA",
    description:
      'Awarded "Most Deployable Application" at an international hackathon for N-sight, a supply-chain toolkit tracking nitrogen allocation from farm soil to retail shelves. Judges\' feedback separately tracked the project as a projected top-2 finalist overall.',
    tier: "S-CLASS",
    icon: "workspace_premium",
  },
  {
    id: "cte-presidential-scholar",
    title: "CTE Presidential Scholar",
    year: null,
    refCode: "CTE-SCHOLAR",
    description:
      "Recognized as a CTE Presidential Scholar, a national honor for career and technical education achievement.",
    tier: "A-CLASS",
    icon: "military_tech",
  },
  {
    id: "eagle-scout",
    title: "Eagle Scout Award Recipient",
    year: null,
    refCode: "BSA-EAGLE",
    description:
      "Earned the Eagle Scout Award, the highest advancement rank in the Boy Scouts of America, recognizing sustained leadership, service, and skill development.",
    tier: "A-CLASS",
    icon: "shield",
  },
  {
    id: "full-tuition-scholarship",
    title: "Full-Tuition Academic Scholarship",
    year: null,
    refCode: "FULLTUITION-01",
    description:
      "Awarded a full-tuition academic scholarship in recognition of academic performance.",
    tier: "A-CLASS",
    icon: "school",
  },
  {
    id: "testout-pc-pro",
    title: "TestOut PC Prep Certificate",
    year: null,
    refCode: "TESTOUT-PCPREP",
    description:
      "Earned the TestOut PC Prep certification, validating foundational PC hardware and troubleshooting competency.",
    tier: "B-CLASS",
    icon: "verified",
  },
];
