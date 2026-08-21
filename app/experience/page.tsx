import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import { employmentEntries, leadershipEntries } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Dallas Walker's real work history and student-org leadership roles.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        title="Experience_Log"
        path="Directory://root/var/log/experience.sys"
        eyebrow={`[MODULE_ID: 02 // ENTRIES: ${String(employmentEntries.length).padStart(3, "0")}]`}
      />

      <section className="mb-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-primary" />
          <h2 className="font-code-label text-code-label text-primary uppercase tracking-[0.2em]">
            Employment_Log
          </h2>
        </div>
        <div className="flex flex-col gap-8">
          {employmentEntries.map((entry) => (
            <ExperienceCard key={`${entry.organization}-${entry.role}`} entry={entry} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-tertiary" />
          <h2 className="font-code-label text-code-label text-tertiary uppercase tracking-[0.2em]">
            Leadership_Modules
          </h2>
        </div>
        <p className="font-body-sm text-on-surface-variant mb-6 max-w-2xl">
          Student-organization leadership roles, kept separate from the employment
          timeline above since they aren&apos;t paid positions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leadershipEntries.map((entry) => (
            <ExperienceCard
              key={`${entry.organization}-${entry.role}`}
              entry={entry}
              showTimelineNode={false}
            />
          ))}
        </div>
      </section>
    </>
  );
}
