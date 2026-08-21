"use client";

import { useMemo, useState } from "react";
import { projects, type ProjectComplexity } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectFilterBar } from "./ProjectFilterBar";
import { ProjectModal } from "./ProjectModal";

const COMPLEXITY_ORDER: readonly ProjectComplexity[] = [
  "Foundational",
  "Intermediate",
  "Advanced",
];

/**
 * Client-side orchestrator for the /projects page: derives filter facets
 * from `data/projects.ts`, holds filter + modal state, and renders the
 * grid/empty-state/modal. The page itself (`app/projects/page.tsx`) stays a
 * server component and only renders this plus the shared `PageHeader`.
 */
export function ProjectsExplorer() {
  const [activeLanguages, setActiveLanguages] = useState<string[]>([]);
  const [activeComplexities, setActiveComplexities] = useState<string[]>([]);
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  const languages = useMemo(
    () => Array.from(new Set(projects.map((p) => p.language))).sort(),
    [],
  );

  const complexities = useMemo(
    () => COMPLEXITY_ORDER.filter((tier) => projects.some((p) => p.complexity === tier)),
    [],
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const languageMatch =
          activeLanguages.length === 0 || activeLanguages.includes(project.language);
        const complexityMatch =
          activeComplexities.length === 0 || activeComplexities.includes(project.complexity);
        return languageMatch && complexityMatch;
      }),
    [activeLanguages, activeComplexities],
  );

  const openProject = projects.find((p) => p.id === openProjectId) ?? null;

  const toggleLanguage = (language: string) => {
    setActiveLanguages((current) =>
      current.includes(language)
        ? current.filter((item) => item !== language)
        : [...current, language],
    );
  };

  const toggleComplexity = (complexity: string) => {
    setActiveComplexities((current) =>
      current.includes(complexity)
        ? current.filter((item) => item !== complexity)
        : [...current, complexity],
    );
  };

  const resetFilters = () => {
    setActiveLanguages([]);
    setActiveComplexities([]);
  };

  return (
    <>
      <ProjectFilterBar
        languages={languages}
        complexities={complexities}
        activeLanguages={activeLanguages}
        activeComplexities={activeComplexities}
        onToggleLanguage={toggleLanguage}
        onToggleComplexity={toggleComplexity}
        onReset={resetFilters}
        resultCount={filteredProjects.length}
        totalCount={projects.length}
      />

      {filteredProjects.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} onViewDetails={setOpenProjectId} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="glass-panel border-l-4 border-l-outline p-8 text-center">
          <span className="material-symbols-outlined text-outline text-[32px] mb-3 inline-block">
            search_off
          </span>
          <p className="font-code-label text-code-label text-primary uppercase mb-2">
            [QUERY_RESULT: NO_MATCHES_FOUND]
          </p>
          <p className="font-body-sm text-on-surface-variant">
            No projects match the current filters. Try clearing a filter above.
          </p>
        </div>
      )}

      {openProject ? (
        <ProjectModal project={openProject} onClose={() => setOpenProjectId(null)} />
      ) : null}
    </>
  );
}
