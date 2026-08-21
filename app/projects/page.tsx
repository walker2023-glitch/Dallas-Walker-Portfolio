import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Real project directory with language and complexity filtering.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Projects_Archive"
        path="Directory://root/usr/bin/projects.sys"
        eyebrow={`[MODULE_ID: 01 // ENTRIES: ${String(projects.length).padStart(3, "0")}]`}
      />
      <ProjectsExplorer />
    </>
  );
}
