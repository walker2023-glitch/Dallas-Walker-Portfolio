/**
 * Navigation single source of truth.
 *
 * Consumed by:
 *   - `components/layout/Sidebar.tsx`   (desktop left nav)
 *   - `components/layout/BottomNav.tsx` (mobile bottom nav + "More" drawer)
 *   - `components/layout/TopBar.tsx`    (mobile menu button)
 *
 * Icon strings are Material Symbols Outlined names (loaded via Google Fonts
 * in `app/layout.tsx`), matching the Stitch mockup 1:1.
 */

export type NavItem = {
  /** Route path (Next.js App Router). */
  href: string;
  /** Label shown in nav (uppercased, terminal-style). */
  label: string;
  /** Short label for the mobile bottom nav (space-constrained). */
  shortLabel: string;
  /** Material Symbols Outlined icon name. */
  icon: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/experience", label: "EXPERIENCE", shortLabel: "Exp", icon: "database" },
  { href: "/projects", label: "PROJECTS", shortLabel: "Proj", icon: "code" },
  { href: "/achievements", label: "ACHIEVEMENTS", shortLabel: "Achieve", icon: "military_tech" },
  { href: "/skills", label: "SKILLS", shortLabel: "Skills", icon: "terminal" },
  { href: "/ai-terminal", label: "AI_TERMINAL", shortLabel: "AI", icon: "smart_toy" },
  { href: "/contact", label: "CONTACT", shortLabel: "Contact", icon: "alternate_email" },
  { href: "/about", label: "ABOUT", shortLabel: "About", icon: "person" },
] as const;

/**
 * The subset of nav items that render in the mobile bottom bar's fixed slots.
 * Everything else lands behind the "More" menu (`MORE_ITEMS`).
 */
export const BOTTOM_NAV_PRIMARY: readonly NavItem[] = NAV_ITEMS.filter((item) =>
  ["/experience", "/projects", "/achievements", "/skills"].includes(item.href),
);

export const BOTTOM_NAV_MORE: readonly NavItem[] = NAV_ITEMS.filter(
  (item) => !BOTTOM_NAV_PRIMARY.includes(item),
);

/**
 * Returns true if the given pathname is (or is a child route of) `href`.
 * The site root (`/`) matches only exactly, never as a prefix.
 */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
