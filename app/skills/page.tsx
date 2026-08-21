import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkillCategoryCard } from "@/components/skills/SkillCategoryCard";
import { skillCategories } from "@/data/skills";

export const metadata: Metadata = {
  title: "Skills",
  description: "Dallas Walker's real technical and professional skill set.",
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        title="Technical_Proficiencies"
        path="Directory://root/usr/bin/skills_assessment.sys"
        eyebrow={`[MODULE_ID: 04 // CATEGORIES: ${String(skillCategories.length).padStart(3, "0")}]`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {skillCategories.map((category) => (
          <SkillCategoryCard key={category.name} category={category} />
        ))}
      </div>
    </>
  );
}
