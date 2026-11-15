"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { AppSidebar } from "@/shared/components/ui/app-sidebar";
import { AppHeader } from "@/shared/layout/AppHeader";
import type { EventRole } from "@/shared/lib/event-permissions";

type AppShellProps = {
  children: ReactNode;
  role: EventRole;
};

function AppSidebarFallback() {
  return (
    <>
      {/* Desktop sidebar placeholder */}
      <aside
        aria-hidden="true"
        className="sticky top-0 hidden h-screen w-[263px] shrink-0 bg-[#0b3048] lg:block"
      />

      {/* Keeps the mobile header's aria-controls target available */}
      <aside
        id="mobile-app-navigation"
        aria-label="Mobile navigation"
        hidden
        className="lg:hidden"
      />
    </>
  );
}

export function AppShell({ children, role }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(true);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#f9f9f9] lg:flex">
      <Suspense fallback={<AppSidebarFallback />}>
        <AppSidebar
          role={role}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      </Suspense>

      <div className="min-w-0 flex-1">
        <AppHeader
          role={role}
          mobileOpen={mobileOpen}
          onMenuClick={() => setMobileOpen((open) => !open)}
        />

        <main id="main-content" className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
