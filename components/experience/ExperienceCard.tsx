import type { ExperienceEntry } from "@/data/experience";

/**
 * Single timeline entry card, adapted from the Stitch Experience mockup's
 * "DEPLOYMENT GRID / TIMELINE" entry pattern (Rough Draft lines 696-810):
 * icon node + glass-panel card with a date/role/org header and a bulleted
 * list of real duties. No fabricated metrics or tags beyond what's derived
 * from the real bullets.
 */
export function ExperienceCard({
  entry,
  showTimelineNode = true,
}: {
  entry: ExperienceEntry;
  showTimelineNode?: boolean;
}) {
  const dateLabel = entry.startDate
    ? `${entry.startDate} – ${entry.current ? "PRESENT" : entry.endDate ?? ""}`
    : null;

  return (
    <div className="flex gap-4 md:gap-6 group">
      {showTimelineNode ? (
        <div className="relative hidden md:block">
          <div className="w-14 h-14 bg-surface-container-highest border border-outline-variant flex items-center justify-center z-10 relative group-hover:border-primary transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" aria-hidden>
              {entry.icon}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex-1 glass-panel p-6 border-l-2 border-l-outline-variant hover:border-l-primary hover:emerald-glow transition-all duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
          <div>
            {dateLabel ? (
              <span className="font-code-label text-code-label text-primary block mb-1 uppercase">
                {dateLabel}
              </span>
            ) : null}
            <h3 className="font-title-sm text-title-sm text-on-surface">{entry.role}</h3>
            <p className="font-body-sm text-secondary">
              {entry.organization}
              {entry.location ? ` // ${entry.location}` : ""}
            </p>
          </div>
          {entry.current ? (
            <span className="bg-secondary-container px-2 py-1 font-ui-utility text-ui-utility text-primary uppercase shrink-0">
              Active
            </span>
          ) : null}
        </div>

        <ul className="space-y-3">
          {entry.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[14px] mt-1" aria-hidden>
                double_arrow
              </span>
              <p className="font-body-sm text-on-surface-variant">{bullet}</p>
            </li>
          ))}
        </ul>

        {entry.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-outline-variant/40">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="border border-outline-variant px-3 py-1 font-code-label text-[10px] text-on-surface-variant uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
