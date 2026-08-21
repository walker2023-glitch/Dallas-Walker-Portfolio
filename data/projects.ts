/**
 * Project directory — typed source of truth for the Projects page (FR-15).
 *
 * Schema per plan §8:
 *   id, title, tag, shortDesc, longDesc, image, icon,
 *   repoUrl: string | null, language, complexity, dateCompleted.
 *
 * Content provenance: descriptions are drawn from the real resume material
 * in docs/plan/portfolio-v2.md Appendix A (richer than the old
 * `old_stuff/javascript.js` copy, which is now retired). No content here
 * comes from the Stitch mockup.
 *
 * `repoUrl` ships `null` for every project right now — this is intentional,
 * not a bug (plan §18 item 11 / FR-9a / AC-9). The Projects UI renders a
 * "not yet public" state instead of a broken link. When the owner cleans up
 * a repo (README, no committed secrets, teammate sign-off for
 * N-sight/Wingman, academic-integrity check for Freezer Penguin) adding the
 * link is a one-line edit here — no component changes required.
 *
 * `dateCompleted` also ships `null` for every project: Appendix A does not
 * supply exact completion dates/timeframes for any project, and inventing
 * one would violate the plan's "no fabricated content" rule. Set a real
 * value (e.g. "2025-11") here once the owner supplies it; the UI already
 * handles the null case.
 *
 * `language` values for FACTOR, N-sight, and Wingman were confirmed directly
 * by the owner (Aug 2026 follow-up) and are no longer inferred. Proxmox Home
 * Server Lab still uses a descriptive "Infrastructure" placeholder since it
 * isn't a single-language project and hasn't been confirmed otherwise.
 *
 * The four Math 326 statistics case studies — FACTOR, Paper Airplane ANOVA,
 * Catapult Ballistics (RCBD), and S.P.O.T. — are sourced directly from their
 * R Markdown / knitted-HTML reports, so their `language` values (R, or
 * Python + R where a data-collection pipeline was involved) come from the
 * reports themselves rather than being inferred.
 */

export type ProjectComplexity = "Foundational" | "Intermediate" | "Advanced";

export interface Project {
  id: string;
  title: string;
  /** Short categorical badge shown on the card (terminal-style, e.g. "FULL_STACK"). */
  tag: string;
  shortDesc: string;
  longDesc: string;
  /** Path under /public, e.g. "/images/factor.png". */
  image: string;
  /** Material Symbols Outlined icon name. */
  icon: string;
  /** null = not yet public; renders a "not yet public" state instead of a link (FR-9a). */
  repoUrl: string | null;
  /** Primary language/stack, used as a filter facet (FR-13). */
  language: string;
  complexity: ProjectComplexity;
  /** ISO "YYYY-MM" or null if not yet supplied by the owner. */
  dateCompleted: string | null;
}

export const projects: Project[] = [
  {
    id: "factor",
    title: "FACTOR",
    tag: "STATS_ANOVA",
    shortDesc:
      "Finding AI Competency Through Objective Results — a multi-way ANOVA benchmark measuring how model, subject, and prompt complexity shift LLM accuracy across 12 foundation models.",
    longDesc:
      "FACTOR (Finding AI Competency Through Objective Results) is a multi-way factorial ANOVA benchmark measuring how model choice, academic subject, and prompt complexity affect LLM accuracy. A Python pipeline queried 12 foundation models across 7 subjects (3 concepts each) in both short and long prompt formats, with 5 replicated trials — a balanced 2,520-row matrix. To strip bias it enforced a programmatic double-blind protocol (responses shuffled behind anonymous UUID hashes, model identity locked in a separate key) and clamped sampling temperature to 0.0 for deterministic decoding. R drove the BF[2] and BF[3] ANOVAs: model architecture and subject were significant predictors of accuracy, while prompt complexity and the higher-order interactions were not.",
    image: "/images/factor.png",
    icon: "query_stats",
    repoUrl: null,
    // Source: Math 326 Case Study 2 (F.A.C.T.O.R..Rmd). Python for API data
    // collection, R for the factorial ANOVA — confirmed by the report itself.
    language: "Python + R",
    complexity: "Advanced",
    dateCompleted: null,
  },
  {
    id: "n-sight",
    title: "N-sight",
    tag: "FULL_STACK",
    shortDesc:
      "International hackathon supply-chain toolkit tracking nitrogen allocation from farm soil to retail shelves — winner, \"Most Deployable Application.\"",
    longDesc:
      "N-sight is an international hackathon supply-chain toolkit, built with Python and Streamlit, that tracks nitrogen allocation from farm soil to retail shelves through an adaptive dark/light UI. A language feature translated the app into every language spoken by attendees at the competition, so anyone there needed only a link to access it (a full companion app was the envisioned next step). Awarded \"Most Deployable Application\" by the judging panel, with feedback tracking it as a projected top-2 finalist.",
    image: "/images/n-sight.jpg",
    icon: "lan",
    repoUrl: null,
    // Confirmed by owner: Python, specifically the Streamlit framework.
    language: "Python",
    complexity: "Advanced",
    dateCompleted: null,
  },
  {
    id: "star-identifier",
    title: "Star Identifier",
    tag: "ML_DOTNET",
    shortDesc:
      "Hybrid rules + ML.NET (C#) classification architecture for sorting astrophysical star profiles.",
    longDesc:
      "Star Identifier pairs a hybrid rules-plus-ML.NET (C#) classification architecture for astrophysical star sorting with a custom preprocessing pipeline that cleans and normalizes stellar attribute data before classification.",
    image: "/images/star-identifier.png",
    icon: "blur_on",
    repoUrl: null,
    // Explicit: Appendix A states "ML.NET (C#)" directly.
    language: "C#",
    complexity: "Intermediate",
    dateCompleted: null,
  },
  {
    id: "freezer-penguin",
    title: "Freezer Penguin",
    tag: "CV_MOBILE_API",
    shortDesc:
      "Food-expiration app that scans barcodes — or reads the same info via computer vision — to track when groceries go bad, then suggests recipes from the Spoonacular API for food that's about to expire.",
    longDesc:
      "Freezer Penguin started as a hackathon build and then continued as a project across three separate classes. It scans the barcodes on food — or captures the same information through computer vision — to help users know when their food will expire, and integrates the Spoonacular API to suggest meals a user can make from the ingredients that are about to go bad. Built as a standardized relational MySQL + Dart application, with Cursor and agentic workflows used to accelerate delivery.",
    image: "/images/freezer-penguin.jpg",
    icon: "barcode_scanner",
    repoUrl: null,
    // Built as a relational MySQL + Dart application (owner-confirmed).
    language: "Dart",
    complexity: "Intermediate",
    dateCompleted: null,
  },
  {
    id: "wingman",
    title: "Wingman",
    tag: "CLOUD_API",
    shortDesc:
      "A dating app that takes the \"what\" out of dating so people can focus on the \"who\" — it offers activities to do together and uses the Gemini API to auto-draft the invitation texts.",
    longDesc:
      "Wingman is a dating app built to take the \"what\" out of dating so people can focus on the \"who.\" Instead of getting stuck on logistics, users pick from a range of built-in activities to do together, and the app integrates the Gemini API to auto-draft the invitation texts. Built with HTML, JavaScript, and CSS, it migrated from a local prototype to AWS production.",
    image: "/images/wingman.png",
    icon: "favorite",
    repoUrl: null,
    // Confirmed by owner: HTML, JavaScript, and CSS.
    language: "HTML/CSS/JavaScript",
    complexity: "Advanced",
    dateCompleted: null,
  },
  {
    id: "proxmox-homelab",
    title: "Proxmox Home Server Lab",
    tag: "DEVOPS_LXC",
    shortDesc:
      "Dell PowerEdge homelab running Proxmox VE, ZFS storage, unprivileged LXC containers, and a Tailscale mesh.",
    longDesc:
      "A self-taught Dell PowerEdge homelab built around the Proxmox VE hypervisor, ZFS storage redundancy, unprivileged LXC containers, Docker Compose workloads, and a Tailscale mesh network — developed using AI-assisted workflows.",
    image: "/images/proxmox-homelab.png",
    icon: "memory",
    repoUrl: null,
    // Not a single-language project — infrastructure/tooling work spanning
    // Proxmox VE, ZFS, LXC, Docker, and Tailscale. Using a descriptive value
    // instead of guessing a specific programming language.
    language: "Infrastructure",
    complexity: "Intermediate",
    dateCompleted: null,
  },
  {
    id: "paper-airplane-anova",
    title: "Paper Airplane ANOVA",
    tag: "STATS_CRD",
    shortDesc:
      "A completely randomized one-way ANOVA comparing three paper-airplane designs (Basic, Hunter, UFO) to find which maximizes flight hang time.",
    longDesc:
      "A designed experiment testing which of three paper-airplane designs — Basic, Hunter, and UFO — yields the longest flight hang time. Five replicates per design (15 launches total) were run through a one-way ANOVA in R, with controls on paper stock, folding, and a fixed launcher to isolate design as the single variable. The Hunter design had the highest mean hang time (1.067 s vs. 1.014 s for UFO and 0.793 s for Basic), and the analysis flagged inconsistent folding as the main driver of extra variance to control in a follow-up.",
    image: "/images/paper-airplane-anova.jpg",
    icon: "flight",
    repoUrl: null,
    // Math 326 Case Study 1 (PlaneReportWalker.html) — analysis authored in R.
    language: "R",
    complexity: "Foundational",
    dateCompleted: null,
  },
  {
    id: "catapult-rcbd",
    title: "Catapult Ballistics (RCBD)",
    tag: "STATS_RCBD",
    shortDesc:
      "A randomized complete block design using a 3D-printed tabletop catapult to test how projectile mass drives flight distance, blocking out rubber-band tension.",
    longDesc:
      "A randomized complete block design (RCBD) built around a 3D-printed tabletop catapult, measuring how projectile mass affects horizontal flight distance. Three projectiles (Cheerios, sour patch kids, big marshmallows) were the treatment; four rubber bands (blue, brown, red, yellow) were the blocking factor for launch force, with R generating the within-block randomization and running the ANOVA. Blocking successfully pulled a large share of variance out of the error term, and projectile mass was a statistically significant predictor of distance — Cheerios flew ~28.6 in on average vs. ~7.1 in for marshmallows.",
    image: "/images/catapult-rcbd.jpg",
    icon: "rocket_launch",
    repoUrl: null,
    // Math 326 Case Study 3 (Catapult.Rmd) — analysis authored in R.
    language: "R",
    complexity: "Intermediate",
    dateCompleted: null,
  },
  {
    id: "spot-solar",
    title: "S.P.O.T. — Solar Power Optimization Test",
    tag: "STATS_SPLIT_PLOT",
    shortDesc:
      "A split-plot experiment measuring how mounting angle and shading affect solar-panel output, driven by a custom Python/ESP32 telemetry pipeline and an R ANOVA.",
    longDesc:
      "A split-plot designed experiment quantifying how photovoltaic micro-panels respond to mounting angle (whole-plot) and surface shading (sub-plot), with individual panels as random blocks. A custom Python script (SPOT.py, Python 3.13) drove an ESP32 microcontroller over serial to capture 60-second voltage/current telemetry per run across 27 randomized runs, logging both mean and median power and fill factor. R ran the split-plot ANOVA: mounting angle, shading, and the panel block were all significant, while the angle×shading interaction was not — a 30° tilt with 0% shading was the top-performing configuration.",
    image: "/images/spot-solar.jpg",
    icon: "solar_power",
    repoUrl: null,
    // Math 326 Case Study 4 (S.P.O.T.). Python 3.13 (ESP32 serial telemetry
    // pipeline, SPOT.py) for data collection; R for the split-plot ANOVA.
    language: "Python + R",
    complexity: "Advanced",
    dateCompleted: null,
  },
];
