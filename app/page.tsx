import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { site } from "@/config/site";

/**
 * Home / hero landing page.
 *
 * Phase 1 stub only — the mockup's hero uses fictional content ("ALEX CHEN
 * // OPERATOR", fake mission statement, fake core values, etc.), all of
 * which is explicitly banned by plan §5 FR-4. Real hero copy lands in
 * Phase 3 with the About-page content.
 *
 * What ships here today is safe, non-fabricated: the real fullName as a
 * banner, module directory of the site, and status of each section.
 */
export default function HomePage() {
  const modules: Array<{
    href: string;
    code: string;
    label: string;
    icon: string;
    phase: number;
  }> = [
    { href: "/projects", code: "MOD_01", label: "Projects", icon: "code", phase: 2 },
    { href: "/experience", code: "MOD_02", label: "Experience", icon: "database", phase: 3 },
    { href: "/achievements", code: "MOD_03", label: "Achievements", icon: "military_tech", phase: 3 },
    { href: "/skills", code: "MOD_04", label: "Skills", icon: "terminal", phase: 3 },
    { href: "/about", code: "MOD_05", label: "About", icon: "person", phase: 3 },
    { href: "/contact", code: "MOD_06", label: "Contact", icon: "alternate_email", phase: 4 },
    { href: "/ai-terminal", code: "MOD_07", label: "AI_Terminal", icon: "smart_toy", phase: 5 },
    { href: "/employer", code: "MOD_08", label: "Employer_View", icon: "badge", phase: 6 },
  ];

  return (
    <>
      <PageHeader
        title={site.fullName}
        path="Directory://root/home/index.sys"
        eyebrow="[OPERATOR_HANDLE // ROOT_NODE]"
      />

      <section className="glass-panel border-l-4 border-l-primary p-6 md:p-8 mb-10">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-primary text-[28px]">terminal</span>
          <div>
            <p className="font-code-label text-code-label text-primary uppercase mb-2 tracking-widest">
              [BOOT_SEQUENCE: PHASE_1_ONLINE]
            </p>
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase mb-3">
              Navigation shell deployed
            </h2>
            <p className="font-body-base text-on-surface-variant leading-relaxed max-w-2xl">
              Design system, routing, and layout scaffolding are live. Real
              hero content, project data, experience history, and the AI
              assistant land in subsequent phases per{" "}
              <code className="font-code-label text-primary">
                docs/plan/portfolio-v2.md §13
              </code>
              .
            </p>
          </div>
        </div>
      </section>

      <div className="mb-6">
        <p className="font-code-label text-code-label text-outline uppercase tracking-widest">
          Module_Directory
        </p>
        <h3 className="font-title-sm text-title-sm text-on-surface uppercase mt-1">
          Available Nodes
        </h3>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <li key={mod.href}>
            <Link
              href={mod.href}
              className="group block bg-surface-container border border-outline-variant p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  {mod.icon}
                </span>
                <span className="font-code-label text-code-label text-outline">
                  {mod.code}
                </span>
              </div>
              <p className="font-title-sm text-title-sm text-on-surface uppercase mb-1 group-hover:text-primary transition-colors">
                {mod.label}
              </p>
              <p className="font-code-label text-code-label text-tertiary uppercase">
                Deployment: Phase_{mod.phase}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
