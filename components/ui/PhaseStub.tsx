/**
 * Phase 1 stub body used on every route.
 *
 * Renders a `glass-panel` card announcing which phase will populate the page
 * with real content. Deliberately carries **no** placeholder personal
 * details — nothing from the Stitch mockup (Alex Chen, Citadel, Stanford,
 * fictional skills) leaks through, per plan §5 FR-4 / AC-4.
 */
export function PhaseStub({
  phase,
  moduleStatus,
  headline,
  detail,
  planRef,
}: {
  /** Phase number that will bring real content (2, 3, 4, or 5). */
  phase: 2 | 3 | 4 | 5;
  /** Short bracketed status tag, e.g. `SCAFFOLD_ONLY`. */
  moduleStatus: string;
  /** One-line description of what's coming. */
  headline: string;
  /** Longer description explaining what will land here. */
  detail: string;
  /** Optional plan section reference, e.g. "§13". */
  planRef?: string;
}) {
  return (
    <section className="glass-panel border-l-4 border-l-primary p-6 md:p-8">
      <p className="font-code-label text-code-label text-primary mb-2 uppercase tracking-widest">
        [MODULE_STATUS: {moduleStatus}]
      </p>
      <h2 className="font-title-sm text-title-sm text-on-surface uppercase mb-4">
        {headline}
      </h2>
      <p className="font-body-sm text-on-surface-variant leading-relaxed max-w-2xl">
        {detail}
      </p>
      <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center justify-between font-code-label text-code-label text-outline uppercase">
        <span>Deployment_Window: Phase_{phase}</span>
        {planRef ? (
          <span className="text-tertiary">docs/plan/portfolio-v2.md {planRef}</span>
        ) : null}
      </div>
    </section>
  );
}
