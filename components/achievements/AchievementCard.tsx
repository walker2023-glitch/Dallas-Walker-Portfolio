import type { Achievement } from "@/data/achievements";

const TIER_STYLES: Record<Achievement["tier"], string> = {
  "S-CLASS": "bg-primary/10 text-primary border-primary/40",
  "A-CLASS": "bg-surface-variant text-primary border-outline-variant",
  "B-CLASS": "bg-surface-variant text-on-surface-variant border-outline-variant",
};

/**
 * Single achievement card, adapted from the Stitch Achievements mockup's
 * card pattern (Rough Draft lines 1132-1157). Tier badge + "VERIFIED" check
 * are decorative styling only (FR-8) — the title/description/year are the
 * real facts from Appendix A.
 */
export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="achievement-card bg-surface-container border border-outline-variant p-6 relative flex flex-col h-full transition-colors hover:border-primary">
      <div className="absolute top-0 right-0 p-2">
        <span
          className={`font-code-label text-[10px] px-2 py-0.5 border uppercase ${TIER_STYLES[achievement.tier]}`}
        >
          {achievement.tier}
        </span>
      </div>

      <div className="mb-4">
        <span className="material-symbols-outlined text-primary text-4xl mb-2 block" aria-hidden>
          {achievement.icon}
        </span>
        <h3 className="font-title-sm text-title-sm text-on-surface leading-tight">
          {achievement.title}
        </h3>
        <p className="font-code-label text-code-label text-outline mt-1 uppercase tracking-widest">
          Year: {achievement.year ?? "PENDING"} | Ref: {achievement.refCode}
        </p>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow mb-6">
        {achievement.description}
      </p>

      <div className="flex items-center gap-2 border-t border-outline-variant pt-4">
        <span
          className="material-symbols-outlined text-primary text-sm"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden
        >
          verified
        </span>
        <span className="font-ui-utility text-ui-utility text-primary">REAL_ACHIEVEMENT</span>
      </div>
    </div>
  );
}
