import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { ResumeFab } from "@/components/ui/ResumeFab";

/**
 * Site-wide layout shell: fixed top bar + fixed left sidebar (desktop) +
 * fixed bottom nav (mobile) + footer, with the page's `{children}` rendered
 * in the main content column.
 *
 * Padding accounts for the fixed chrome so page content doesn't underlay it:
 *   - `pt-12`     — top bar (48px)
 *   - `pb-16`     — mobile bottom nav (64px); no-op on `lg`
 *   - `lg:pl-64`  — desktop sidebar (256px); no-op on `<lg`
 */
export function NavShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Sidebar />

      <div className="flex-1 flex flex-col pt-12 lg:pl-64">
        <main
          id="main"
          className="flex-1 px-margin-mobile md:px-margin-desktop py-8 md:py-12 pb-24 lg:pb-12"
        >
          <div className="mx-auto max-w-container-max">{children}</div>
        </main>
        <Footer />
      </div>

      <BottomNav />
      <ResumeFab />
    </div>
  );
}
