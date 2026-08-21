"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BOTTOM_NAV_MORE,
  BOTTOM_NAV_PRIMARY,
  isActive,
  type NavItem,
} from "@/lib/nav";

/**
 * Mobile bottom navigation, per the Stitch mockup (Rough Draft lines
 * 2477-2498). Four primary destinations plus a "More" menu that opens an
 * inline drawer with the remaining nav items — this is how everything from
 * `NAV_ITEMS` stays reachable below the `lg` breakpoint where the sidebar
 * is hidden.
 */
export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <>
      {moreOpen && (
        <div
          role="presentation"
          onClick={() => setMoreOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {moreOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Additional navigation"
          className="lg:hidden fixed inset-x-0 bottom-[64px] z-50 bg-surface-container border-t border-outline-variant px-margin-mobile pt-4 pb-6"
        >
          <p className="font-code-label text-[10px] text-outline uppercase mb-3">
            More_Modules
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {BOTTOM_NAV_MORE.map((item) => (
              <li key={item.href}>
                <BottomNavLink item={item} pathname={pathname} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-surface-container border-t border-outline-variant px-4 flex justify-around items-center"
      >
        {BOTTOM_NAV_PRIMARY.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex flex-col items-center gap-1 min-w-[52px] py-1 transition-colors",
                active ? "text-primary" : "text-on-surface-variant",
              ].join(" ")}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-ui-utility text-[9px] uppercase">{item.shortLabel}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
          aria-expanded={moreOpen}
          aria-controls="mobile-more-menu"
          className={[
            "flex flex-col items-center gap-1 min-w-[52px] py-1 transition-colors",
            moreOpen ? "text-primary" : "text-on-surface-variant",
          ].join(" ")}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={moreOpen ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {moreOpen ? "close" : "menu"}
          </span>
          <span className="font-ui-utility text-[9px] uppercase">More</span>
        </button>
      </nav>
    </>
  );
}

function BottomNavLink({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={[
        "flex items-center gap-3 font-ui-utility text-ui-utility px-3 py-3 border transition-colors",
        active
          ? "border-primary text-primary bg-secondary-container"
          : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary",
      ].join(" ")}
    >
      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
      {item.label}
    </Link>
  );
}
