import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { achievements } from "@/data/achievements";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Dallas Walker's real achievements, awards, and hackathon results.",
};

export default function AchievementsPage() {
  return (
    <>
      <PageHeader
        title="Milestone_Log"
        path="Directory://root/var/log/achievements.sys"
        eyebrow={`[MODULE_ID: 03 // ENTRIES: ${String(achievements.length).padStart(3, "0")}]`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      <section className="bg-surface-container-low border border-outline-variant p-6 md:p-8">
        <div className="flex items-start gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-xl" aria-hidden>
            info
          </span>
          <div>
            <h2 className="font-title-sm text-title-sm text-on-surface uppercase mb-1">
              Verification_Console
            </h2>
            <p className="font-body-sm text-on-surface-variant max-w-2xl">
              The tier badges and status bars on this page are a stylized visual
              motif for the site&apos;s terminal aesthetic — not a real blockchain
              or third-party verification service. Every achievement listed above
              is real; nothing here is cryptographically verified, and nothing
              should be read as an official credentialing claim.
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <span className="font-code-label text-code-label text-outline uppercase">
              Display_Style
            </span>
            <span className="font-code-label text-code-label text-primary">COSMETIC_ONLY</span>
          </div>
          <div className="w-full bg-surface-variant h-1">
            <div className="bg-primary h-full w-full" />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-code-label text-code-label text-outline uppercase">
              Content_Accuracy
            </span>
            <span className="font-code-label text-code-label text-primary">100% REAL</span>
          </div>
          <div className="w-full bg-surface-variant h-1">
            <div className="bg-primary h-full w-full" />
          </div>
        </div>
      </section>
    </>
  );
}
