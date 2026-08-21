import Link from "next/link";
import { site } from "@/config/site";

/**
 * Fixed top bar carrying the SYSTEM_CORE_V1.0 branding, per the Stitch
 * mockup's `<header>` (Rough Draft lines 141-154).
 *
 * On mobile the sidebar is hidden, so this bar also owns the menu affordance
 * — for Phase 1 that's a static icon (mobile bottom nav does the real work);
 * the "More" drawer opens from `BottomNav` instead.
 */
export function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-12 bg-surface-dim border-b border-outline-variant">
      <div className="mx-auto max-w-container-max h-full flex items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label={`${site.fullName} — home`}
        >
          <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
          <span className="font-code-label text-code-label tracking-tighter text-primary group-hover:emerald-glow transition-all">
            {site.brand}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3 font-code-label text-code-label text-outline">
          <span className="hidden lg:inline">OPERATOR::</span>
          <span className="text-on-surface-variant">{site.fullName.toUpperCase()}</span>
          <span className="h-4 w-px bg-outline-variant" aria-hidden />
          <span className="text-primary">SYSTEM_STATUS: ONLINE</span>
        </div>

        <span
          className="material-symbols-outlined text-primary md:hidden text-[22px]"
          aria-hidden
        >
          menu
        </span>
      </div>
    </header>
  );
}
