import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";
import { employmentEntries } from "@/data/experience";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Employer View",
  description:
    "A concise overview of Dallas Walker's experience, selected projects, resume, and contact information.",
};

const featuredProjectIds = ["vibecheck", "factor", "proxmox-homelab"];
const featuredProjects = featuredProjectIds
  .map((id) => projects.find((project) => project.id === id))
  .filter((project) => project !== undefined);

export default function EmployerPage() {
  const relevantExperience = employmentEntries.filter(
    (entry) =>
      entry.current ||
      entry.role.startsWith("Online TA Supervisor") ||
      entry.role.startsWith("Teaching Assistant"),
  );

  return (
    <>
      <PageHeader
        title="Employer_Overview"
        path="Directory://root/employer/index.sys"
        eyebrow="[QUICK_READ // INTERNSHIP_CANDIDATE]"
      />

      <section className="glass-panel border-l-4 border-l-primary p-6 md:p-8 mb-8">
        <p className="font-code-label text-code-label text-primary uppercase tracking-widest mb-2">
          {site.fullName}
        </p>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
          Computer Science + Statistics
        </h2>
        <p className="font-body-base text-on-surface-variant leading-relaxed max-w-3xl">
          BYU–Idaho double major, expected to graduate Fall 2028. Seeking
          software, AI, and data internships for Summer 2027.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={site.resumeUrls.general}
            className="bg-primary text-on-primary px-4 py-3 font-ui-utility text-ui-utility uppercase hover:opacity-90 transition-opacity"
          >
            Download resume
          </a>
          <a
            href={`mailto:${site.email}`}
            className="border border-outline-variant text-on-surface px-4 py-3 font-ui-utility text-ui-utility uppercase hover:border-primary hover:text-primary transition-colors"
          >
            Contact Dallas
          </a>
          <a
            href={site.linkedInUrl}
            target="_blank"
            rel="noreferrer"
            className="border border-outline-variant text-on-surface px-4 py-3 font-ui-utility text-ui-utility uppercase hover:border-primary hover:text-primary transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </section>

      <section className="mb-10" aria-labelledby="employer-experience">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2 h-2 bg-primary" aria-hidden />
          <h2 id="employer-experience" className="font-code-label text-code-label text-primary uppercase tracking-[0.2em]">
            Relevant_Experience
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relevantExperience.map((entry) => (
            <article key={`${entry.organization}-${entry.role}`} className="glass-panel p-5">
              <p className="font-code-label text-code-label text-primary uppercase mb-2">
                {entry.startDate} – {entry.current ? "Present" : entry.endDate}
              </p>
              <h3 className="font-title-sm text-title-sm text-on-surface">{entry.role}</h3>
              <p className="font-body-sm text-secondary mb-3">{entry.organization}</p>
              <ul className="space-y-2">
                {entry.bullets.slice(0, 2).map((bullet) => (
                  <li key={bullet} className="font-body-sm text-on-surface-variant leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <Link href="/experience" className="inline-block mt-4 font-ui-utility text-ui-utility text-primary uppercase hover:underline">
          View full experience
        </Link>
      </section>

      <section className="mb-10" aria-labelledby="employer-projects">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-tertiary" aria-hidden />
          <h2 id="employer-projects" className="font-code-label text-code-label text-tertiary uppercase tracking-[0.2em]">
            Selected_Projects
          </h2>
        </div>
        <p className="font-body-sm text-on-surface-variant mb-5 max-w-3xl">
          Project summaries and available public artifacts are shown here. Skill claims are not marked as verified.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featuredProjects.map((project) => (
            <article key={project.id} className="glass-panel overflow-hidden">
              <div className="relative project-image">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="font-title-sm text-title-sm text-on-surface">{project.title}</h3>
                  {project.status === "in-progress" ? (
                    <span className="border border-outline-variant px-2 py-1 font-code-label text-[10px] text-primary uppercase">
                      In progress
                    </span>
                  ) : null}
                </div>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                  {project.shortDesc}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {project.evidence?.map((item) => (
                    <a
                      key={item.url}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-ui-utility text-ui-utility text-primary uppercase hover:underline"
                    >
                      {item.label}
                    </a>
                  ))}
                  <Link href="/projects" className="font-ui-utility text-ui-utility text-on-surface-variant uppercase hover:text-primary">
                    Project archive
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-panel p-6 md:p-8" aria-labelledby="employer-contact">
        <h2 id="employer-contact" className="font-title-sm text-title-sm text-on-surface mb-2">
          Let’s connect
        </h2>
        <p className="font-body-sm text-on-surface-variant mb-4">
          I’m happy to discuss my work and Summer 2027 internship opportunities.
        </p>
        <a href={`mailto:${site.email}`} className="font-ui-utility text-ui-utility text-primary uppercase hover:underline">
          {site.email}
        </a>
      </section>
    </>
  );
}
