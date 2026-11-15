"use client";

import { Mail, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import {
  EVENT_ROLE_LABELS,
  type EventRole,
} from "@/shared/lib/event-permissions";

type AppHeaderProps = {
  role: EventRole;
  showEventSidebar: boolean;
  mobileOpen: boolean;
  onMenuClick: () => void;
};

export function AppHeader({
  role,
  showEventSidebar,
  mobileOpen,
  onMenuClick,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[#c0c7d0] bg-white px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {showEventSidebar && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-app-navigation"
            className="flex size-10 items-center justify-center rounded-lg text-[#2c4558] hover:bg-[#f3f3f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] lg:hidden"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        )}

        <span className="truncate text-base font-semibold text-[#0b3048] lg:hidden">
          BCC EventOps
        </span>

        <span className="hidden text-sm font-medium text-[#4b718e] lg:block">
          Event Operations
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/invitations"
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[#41474f] hover:bg-[#f3f3f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a]"
        >
          <Mail className="size-[18px]" />
          <span className="hidden sm:inline">Invitations</span>
        </Link>

        <div className="flex items-center gap-2 border-l border-[#c0c7d0] pl-3 md:pl-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e9f2fe] text-[#00517d]">
            <UserRound className="size-5" />
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-36 truncate text-sm font-semibold text-[#1a1c1c]">
              {EVENT_ROLE_LABELS[role]}
            </p>
            <p className="text-xs text-[#4b718e]">Current event role</p>
          </div>
        </div>
      </div>
    </header>
  );
}
