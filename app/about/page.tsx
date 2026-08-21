import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { profileBlurb, education } from "@/data/about";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: "Dallas Walker's real profile and education.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Operator_Profile"
        path="Directory://root/home/about.sys"
        eyebrow="[MODULE_ID: 05]"
      />

      <div className="grid grid-cols-12 gap-gutter">
        {/* Left column: identity */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-surface-container border border-outline-variant p-4">
            <div className="group aspect-[3/4] w-full bg-surface-container-low mb-6 border border-outline-variant relative overflow-hidden">
              <Image
                src="/images/dallas-walker-about.png"
                alt="Dallas Walker — professional portrait"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h2 className="font-display-lg text-display-lg text-on-surface tracking-tighter uppercase">
                {site.fullName}
              </h2>
              <p className="font-code-label text-primary opacity-80 uppercase mt-1">
                {education.institution}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-surface-container-low border border-outline-variant p-3">
                <p className="font-code-label text-[10px] text-outline mb-1 uppercase">Status</p>
                <p className="font-ui-utility text-ui-utility text-primary">{education.status}</p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant p-3">
                <p className="font-code-label text-[10px] text-outline mb-1 uppercase">GPA</p>
                <p className="font-ui-utility text-ui-utility text-primary">{education.gpa}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-ui-utility text-ui-utility text-outline uppercase">
                Contact_Links
              </h3>
              <div className="flex items-center gap-2 bg-primary/10 px-2 py-1 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-code-label text-[10px] text-primary">ACTIVE</span>
              </div>
            </div>
            <ul className="space-y-2 font-body-sm text-body-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.githubUrl}
                  className="text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={site.linkedInUrl}
                  className="text-on-surface-variant hover:text-primary transition-colors underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column: bio + education */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-gutter">
          <div className="bg-surface-container border border-outline-variant p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-sm" aria-hidden>
                  history_edu
                </span>
              </div>
              <h3 className="font-title-sm text-title-sm text-on-surface">System_Bio</h3>
            </div>
            <p className="font-body-base text-body-base text-on-surface-variant leading-relaxed">
              {profileBlurb}
            </p>
          </div>

          <div className="bg-surface-container border border-outline-variant p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-tertiary/10 border border-tertiary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-sm" aria-hidden>
                  school
                </span>
              </div>
              <h3 className="font-title-sm text-title-sm text-on-surface">Education</h3>
            </div>
            <h4 className="font-body-base text-on-surface font-semibold">{education.degree}</h4>
            <p className="font-body-sm text-secondary mt-1">
              {education.institution} // {education.location}
            </p>
            <p className="font-code-label text-code-label text-outline uppercase mt-2">
              {education.status} · GPA {education.gpa}
            </p>

            <div className="mt-6 pt-4 border-t border-outline-variant">
              <h5 className="font-ui-utility text-ui-utility text-outline uppercase mb-3">
                Awards
              </h5>
              <ul className="space-y-2">
                {education.awards.map((award) => (
                  <li key={award} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[14px] mt-1" aria-hidden>
                      double_arrow
                    </span>
                    <p className="font-body-sm text-on-surface-variant">{award}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
