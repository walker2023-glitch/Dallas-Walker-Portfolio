/**
 * Filter controls for the /projects grid (FR-13): toggle chips for
 * language and complexity. Both facets are multi-select and OR together
 * within a facet, AND across facets — an empty selection in a facet means
 * "no filter" for that facet, matching the empty-state semantics in AC-6.
 */
export function ProjectFilterBar({
  languages,
  complexities,
  activeLanguages,
  activeComplexities,
  onToggleLanguage,
  onToggleComplexity,
  onReset,
  resultCount,
  totalCount,
}: {
  languages: readonly string[];
  complexities: readonly string[];
  activeLanguages: readonly string[];
  activeComplexities: readonly string[];
  onToggleLanguage: (language: string) => void;
  onToggleComplexity: (complexity: string) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}) {
  const filtersActive = activeLanguages.length > 0 || activeComplexities.length > 0;

  return (
    <div className="bg-surface-container border border-outline-variant p-4 md:p-5 mb-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <span className="font-code-label text-[10px] text-outline uppercase tracking-widest">
            Filter_By_Language
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by language">
            {languages.map((language) => {
              const active = activeLanguages.includes(language);
              return (
                <FilterChip
                  key={language}
                  label={language}
                  active={active}
                  onClick={() => onToggleLanguage(language)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-code-label text-[10px] text-outline uppercase tracking-widest">
            Filter_By_Complexity
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by complexity">
            {complexities.map((complexity) => {
              const active = activeComplexities.includes(complexity);
              return (
                <FilterChip
                  key={complexity}
                  label={complexity}
                  active={active}
                  onClick={() => onToggleComplexity(complexity)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40 font-code-label text-code-label">
        <span className="text-primary" aria-live="polite">
          SHOWING: {String(resultCount).padStart(3, "0")} / {String(totalCount).padStart(3, "0")}
        </span>
        {filtersActive ? (
          <button
            type="button"
            onClick={onReset}
            className="text-outline hover:text-primary transition-colors uppercase"
          >
            [RESET_FILTERS]
          </button>
        ) : null}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "px-3 py-1 font-ui-utility text-ui-utility uppercase border transition-all",
        active
          ? "bg-primary text-on-primary border-primary"
          : "bg-transparent text-on-surface-variant border-outline-variant hover:border-primary hover:text-primary",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
