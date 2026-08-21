import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * Single project card for the /projects grid.
 *
 * Layout mirrors the old static site's `.project-card` (old_stuff/style.css)
 * but ported to the terminal-system design tokens. Clicking "VIEW_SPEC"
 * opens the detail modal via `onViewDetails` (state lives in the parent
 * `ProjectsExplorer`, which is the only client-interactive piece here).
 */
export function ProjectCard({
  project,
  onViewDetails,
}: {
  project: Project;
  onViewDetails: (id: string) => void;
}) {
  return (
    <article className="bg-surface-container border border-outline-variant flex flex-col overflow-hidden hover:border-primary transition-colors">
      <div className="project-image-frame bg-surface-container-lowest">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="project-image grayscale-[15%]"
        />
        <span className="absolute top-2 left-2 bg-surface-dim/90 border border-outline-variant px-2 py-0.5 font-code-label text-[10px] text-primary uppercase">
          {project.tag}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-title-sm text-title-sm text-on-surface uppercase mb-2">
          {project.title}
        </h3>
        <p className="font-body-sm text-on-surface-variant leading-relaxed mb-4 flex-1">
          {project.shortDesc}
        </p>

        <div className="flex items-center gap-2 mb-4 font-code-label text-[10px] uppercase">
          <span className="px-2 py-0.5 border border-outline-variant text-tertiary">
            {project.language}
          </span>
          <span className="px-2 py-0.5 border border-outline-variant text-outline">
            {project.complexity}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
          <span className="material-symbols-outlined text-primary text-[20px]" aria-hidden>
            {project.icon}
          </span>
          <button
            type="button"
            onClick={() => onViewDetails(project.id)}
            className="font-code-label text-code-label text-primary hover:emerald-glow transition-all"
          >
            VIEW_SPEC -&gt;
          </button>
        </div>
      </div>
    </article>
  );
}
