"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useEffect, useRef, useState } from "react";

import { AppSidebar } from "@/shared/components/ui/app-sidebar";
import { AppHeader } from "@/shared/layout/AppHeader";
import type { EventRole } from "@/shared/lib/event-permissions";

type AppShellProps = {
  children: ReactNode;
  role: EventRole;
};

function AppShellFallback({ children, role }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <AppHeader
        role={role}
        showEventSidebar={false}
        mobileOpen={false}
        onMenuClick={() => undefined}
      />
      <main id="main-content" className="min-w-0">
        {children}
      </main>
    </div>
  );
}

function AppShellContent({ children, role }: AppShellProps) {
  const pathname = usePathname() ?? "/";

  const matchedEventId = pathname.match(/^\/events\/([^/]+)(?:\/|$)/)?.[1];

  const eventId =
    matchedEventId && matchedEventId !== "create" ? matchedEventId : null;

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      setMobileOpen(false);
    }
  }, [pathname]);

  // Allow Escape to close the mobile drawer.
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
      {eventId && (
        <AppSidebar
          role={role}
          eventId={eventId}
          pathname={pathname}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
      )}

      <div className="min-w-0 flex-1">
        <AppHeader
          role={role}
          showEventSidebar={Boolean(eventId)}
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

export function AppShell({ children, role }: AppShellProps) {
  return (
    <Suspense
      fallback={<AppShellFallback role={role}>{children}</AppShellFallback>}
    >
      <AppShellContent role={role}>{children}</AppShellContent>
    </Suspense>
  );
}
