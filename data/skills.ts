/**
 * Skills directory — typed source of truth for the Skills page (FR-15,
 * plan §18 item 4).
 *
 * Content provenance: transcribed verbatim from docs/plan/portfolio-v2.md
 * Appendix A ("Skills" section) — the resume is the sole source of truth
 * here. The old hero section's C++/Rust/PyTorch/Vulkan/DX12 claims are NOT
 * on the resume and must never appear on this site again.
 *
 * Deliberately no invented proficiency percentages, "EXPERT/ADVANCED"
 * labels, or level numbers per skill (the Stitch mockup's skill bars) —
 * Appendix A gives a flat list per category with no per-skill rating, and
 * assigning one would be fabricated data.
 */

export interface SkillCategory {
  name: string;
  /** Material Symbols Outlined icon name. */
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    icon: "code",
    skills: ["Python (Polars)", "C#", "R", "SQL", "HTML/CSS", "JavaScript", "Dart"],
  },
  {
    name: "Frameworks & Tools",
    icon: "hub",
    skills: [
      "FastAPI",
      "SQLModel",
      "Uvicorn",
      "ML.NET",
      "Proxmox VE",
      "ZFS",
      "Tailscale",
      "Docker",
      "LXC",
      "MySQL",
      "AWS",
      "Git",
    ],
  },
  {
    name: "Concepts & Practices",
    icon: "psychology",
    skills: [
      "Agentic Engineering",
      "DevOps",
      "Prompt Engineering",
      "OOP",
      "Agile",
      "ANOVA & Stats",
    ],
  },
  {
    name: "Professional",
    icon: "groups",
    skills: [
      "Project Management",
      "Mentoring",
      "Leadership",
      "Public Speaking",
      "Multilingual (Cantonese)",
    ],
  },
  {
    name: "Other / Personal",
    icon: "interests",
    skills: ["3D Printing", "Running", "Piano"],
  },
];
