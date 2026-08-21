"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "@/lib/nav";

/**
 * Persistent desktop left sidebar ("ROOT_DIRECTORY"), per the Stitch mockup
 * (Rough Draft lines 156-193).
 *
 * Client component only because it reads `usePathname()` to apply the
 * active-state styling (`bg-secondary-container text-primary
 * border-l-2 border-primary`) matching the Stitch design.
 *
 * Hidden below the `lg` breakpoint; on smaller screens the `BottomNav`
 * component takes over.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Primary navigation"
      className="fixed left-0 top-12 bottom-0 z-40 w-64 bg-surface-container border-r border-outline-variant hidden lg:flex flex-col"
    >
      <div className="px-4 py-6 border-b border-outline-variant mb-4">
        <h2 className="font-headline-md text-headline-md text-primary tracking-tight">
          ROOT_DIRECTORY
        </h2>
        <p className="font-code-label text-[10px] text-outline mt-1 uppercase">
          nav_index.sys
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-3 font-ui-utility text-ui-utility px-4 py-2 transition-all duration-75",
                active
                  ? "bg-secondary-container text-primary border-l-2 border-primary active:scale-[0.98]"
                  : "text-on-surface-variant border-l-2 border-transparent hover:bg-surface-container-highest hover:text-on-surface",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Subtle system-monitoring flourish from the Stitch design.
          Numbers are static in Phase 1 — this is decorative, not real telemetry. */}
      <div className="mt-auto px-4 pb-6">
        <div className="bg-surface-container-low p-3 border border-outline-variant">
          <p className="font-code-label text-[10px] text-outline mb-2 uppercase">System_Load</p>
          <div className="w-full h-1 bg-surface-variant overflow-hidden">
            <div className="h-full bg-primary w-2/3" />
          </div>
          <p className="font-code-label text-[10px] text-primary mt-1">68.4% STABLE</p>
        </div>
      </div>
    </aside>
  );
}
