/**
 * Experience directory — typed source of truth for the Experience page (FR-12, FR-15).
 *
 * Content provenance: every entry is transcribed from the real resume
 * material in docs/plan/portfolio-v2.md Appendix A ("Experience" and
 * "Leadership" sections). No content here comes from the Stitch mockup.
 *
 * Schema note vs. plan §8: the plan's `ExperienceEntry` shape suggests
 * `startDate` / `endDate` as machine-readable-ish fields, but Appendix A
 * gives dates at mixed precision (some "Month Year", some year-only) and the
 * two Leadership entries have no dates at all. To avoid inventing precision
 * that isn't in the source, `startDate` / `endDate` are stored as free-form
 * display strings exactly as written in Appendix A, and both are nullable
 * for entries where the resume gives no date (Leadership). `endDate: null`
 * with `current: true` marks the one still-ongoing role ("Present").
 *
 * `kind` is an addition (not in the original §8 sketch) so the Experience
 * page can render Leadership as a visually distinct subsection rather than
 * mixing it into the employment timeline, per the owner's explicit
 * instruction and plan §18 item 1.
 */

export type ExperienceKind = "employment" | "leadership";

export interface ExperienceEntry {
  kind: ExperienceKind;
  role: string;
  organization: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  /** True if this role is ongoing ("Present" on the resume). */
  current: boolean;
  bullets: string[];
  /** Decorative categorical tags, derived from the real bullets above — not additional facts. */
  tags: string[];
  /** Material Symbols Outlined icon name. */
  icon: string;
}

export const experience: ExperienceEntry[] = [
  {
    kind: "employment",
    role: "Systems Improvement and Training Specialist",
    organization: "Brigham Young University–Idaho Facilities Management Services",
    location: "Rexburg, ID",
    startDate: "May 2026",
    endDate: null,
    current: true,
    bullets: [
      "Migrated equipment-maintenance reporting from a Python dashboard to Power BI, combining monthly CompuClean service-order data to track repair hours, turnaround, and capacity.",
    ],
    tags: ["Power BI", "Python", "Reporting Workflows"],
    icon: "monitoring",
  },

  {
    kind: "employment",
    role: "Online TA Supervisor / Data Analyst",
    organization: "Brigham Young University–Idaho",
    location: "Rexburg, ID",
    startDate: "Apr 2026",
    endDate: "Aug 2026",
    current: false,
    bullets: [
      "Used Workday analytics to audit compliance metrics (active hours, survey completion) across 40+ remote TAs, building a data-backed accountability framework that reduced time-tracking variance.",
      "Ran one-on-one mentorship calls (weeks 2 and 7) to align individual performance with team standards and boost morale.",
    ],
    tags: ["Data Analysis", "Workday", "Team Accountability"],
    icon: "monitoring",
  },
  {
    kind: "employment",
    role: "Teaching Assistant (CSE 210 & Agribusiness)",
    organization: "Brigham Young University–Idaho",
    location: "Rexburg, ID",
    startDate: "Sep 2023",
    endDate: null,
    current: true,
    bullets: [
      "Used a professor-configured AI pipeline to generate baseline feedback on ~40 weekly agribusiness essays outside his technical domain, manually verifying output for grading consistency.",
      "Built a custom AI utility generating tiered (A/B/C) code exemplars to help CS students grasp programming abstractions.",
    ],
    tags: ["Teaching", "AI Tooling", "Grading Systems"],
    icon: "school",
  },
  {
    kind: "employment",
    role: "Instructor",
    organization: "Mathnasium",
    location: "Saratoga Springs, UT",
    startDate: "2022",
    endDate: "2023",
    current: false,
    bullets: [
      "Simplified math instruction (e.g. reframing multi-digit addition into base-10 groupings) for students aged 6–18, improving fluency/confidence for 50+ students.",
      "Ran peer-to-peer staff training to standardize teaching methodology across the center.",
    ],
    tags: ["Teaching", "Curriculum Design", "Staff Training"],
    icon: "calculate",
  },
  {
    kind: "employment",
    role: "Manufacturer",
    organization: "iSignCo",
    location: "Saratoga Springs, UT",
    startDate: "2019",
    endDate: "2022",
    current: false,
    bullets: [
      "Operated industrial sheet-metal-bending machinery and wired LED lighting configurations for enterprise commercial accounts.",
      "Performed high-altitude field installations on boom lifts; 100% incident-free safety record over three years.",
    ],
    tags: ["Manufacturing", "Field Installation", "Safety"],
    icon: "precision_manufacturing",
  },
  {
    kind: "employment",
    role: "Team Leader",
    organization: "STAR Camp",
    location: "Ogden, UT",
    startDate: "Jun 2022",
    endDate: "Jul 2022",
    current: false,
    bullets: [
      "Guided up to 90 campers through a model rocket aerodynamics course; enforced safety protocols for a 100% incident-free log.",
      "Diagnosed a launch failure and recalibrated build guidelines, achieving perfect launch success in subsequent cohorts.",
      "Designed and taught a public-speaking curriculum drawing on a speech and debate background.",
    ],
    tags: ["Team Leadership", "STEM Education", "Public Speaking"],
    icon: "rocket_launch",
  },
  {
    kind: "employment",
    role: "Cashier and Sales Representative",
    organization: "Arctic Circle",
    location: "Saratoga Springs, UT",
    startDate: "2021",
    endDate: "2022",
    current: false,
    bullets: [
      "Took ownership of point-of-sale registers during volume surges to unblock kitchen queue backlogs.",
      "Processed high-volume transactions with 100% till reconciliation accuracy; boosted operational efficiency ~75%.",
    ],
    tags: ["Customer Service", "Operations"],
    icon: "point_of_sale",
  },
  {
    kind: "leadership",
    role: "President",
    organization: "AI Society",
    location: null,
    startDate: null,
    endDate: null,
    current: false,
    bullets: [
      "Designed tiered workshops (prompt engineering, local LLM installs) for technical and non-technical students.",
      "Built and deployed an open-source landing page.",
      "Recruited outside speakers (e.g. Matt Fischer) via cold outreach.",
    ],
    tags: ["Leadership", "AI Education", "Community Building"],
    icon: "smart_toy",
  },
  {
    kind: "leadership",
    role: "President & VP",
    organization: "Computer Society",
    location: null,
    startDate: null,
    endDate: null,
    current: false,
    bullets: [
      "Redirected the society from logistics-only toward technical growth (mission statement, weekly tracking agendas).",
      "Organized a week-long collegiate hackathon spanning Useful Tech, Useless Tech, and AI Slot Machine tracks.",
    ],
    tags: ["Leadership", "Organizational Strategy", "Event Planning"],
    icon: "groups",
  },
];

export const employmentEntries = experience.filter((e) => e.kind === "employment");
export const leadershipEntries = experience.filter((e) => e.kind === "leadership");
