/**
 * Reusable page header, per the Stitch mockup pattern
 * (Rough Draft lines 198-201): a left-border accent, a display-lg title,
 * and a code-label "Directory://" subtitle.
 *
 * Every top-level route uses this so pages feel like siblings inside the
 * same terminal-system aesthetic.
 */
export function PageHeader({
  title,
  path,
  eyebrow,
}: {
  /** Page title (rendered UPPERCASE). */
  title: string;
  /** Fake filesystem path shown as a monospace subtitle. */
  path: string;
  /** Optional caption above the title (e.g. "[MODULE_ID: 04]"). */
  eyebrow?: string;
}) {
  return (
    <div className="mb-12 border-l-4 border-primary pl-4 md:pl-6">
      {eyebrow ? (
        <p className="font-code-label text-code-label text-primary uppercase mb-2 tracking-widest">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display-lg text-display-lg text-on-surface tracking-tighter uppercase">
        {title}
      </h1>
      <p className="font-code-label text-code-label text-outline uppercase mt-1">
        {path}
      </p>
    </div>
  );
}
