import type { SkillCategory } from "@/data/skills";

/**
 * Single skill category card. Deliberately renders skills as a flat chip
 * list rather than the Stitch mockup's percentage bars / "EXPERT" labels —
 * Appendix A gives no per-skill rating, and inventing one would be
 * fabricated data.
 */
export function SkillCategoryCard({ category }: { category: SkillCategory }) {
  return (
    <div className="bg-surface-container border border-outline-variant p-5 h-full">
      <div className="flex items-center gap-2 mb-5 border-b border-outline-variant pb-3">
        <span className="material-symbols-outlined text-primary" aria-hidden>
          {category.icon}
        </span>
        <h3 className="font-title-sm text-title-sm text-on-surface">{category.name}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="bg-surface-container-high border border-outline-variant px-3 py-1.5 font-body-sm text-body-sm text-on-surface-variant"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
