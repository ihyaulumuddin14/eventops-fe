"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  ListOrdered,
  Megaphone,
  Pencil,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import type { EventRole } from "@/shared/lib/event-permissions";
import { can, EVENT_ROLE_LABELS } from "@/shared/lib/event-permissions";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

type AppSidebarProps = {
  role: EventRole;
  eventId: string;
  pathname: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

type SidebarContentProps = {
  role: EventRole;
  pathname: string;
  eventId: string;
  onNavigate?: () => void;
};

function getEventSections(
  eventId: string,
  role: EventRole,
): NavigationSection[] {
  const sections: NavigationSection[] = [
    {
      title: "EVENT WORKSPACE",
      items: [
        {
          label: "Overview",
          href: `/events/${eventId}`,
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
  ];

  const informationItems: NavigationItem[] = [];

  if (can(role, "viewRundown")) {
    informationItems.push({
      label: "Rundown & Sessions",
      href: `/events/${eventId}/manage/sessions`,
      icon: ListOrdered,
    });
  }

  if (can(role, "viewAnnouncements")) {
    informationItems.push({
      label: "Announcements",
      href: `/events/${eventId}/manage/announcements`,
      icon: Megaphone,
      exact: true,
    });
  }

  if (informationItems.length > 0) {
    sections.push({
      title: "INFORMATION",
      items: informationItems,
    });
  }

  const managementItems: NavigationItem[] = [];

  if (can(role, "editEvent")) {
    managementItems.push({
      label: "Edit Event",
      href: `/events/${eventId}/manage/edit`,
      icon: Pencil,
      exact: true,
    });
  }

  if (can(role, "manageCommittee")) {
    managementItems.push({
      label: "Committee",
      href: `/events/${eventId}/manage/committee`,
      icon: Users,
      exact: true,
    });
  }

  if (managementItems.length > 0) {
    sections.push({
      title: "MANAGEMENT",
      items: managementItems,
    });
  }

  const operationItems: NavigationItem[] = [];

  if (can(role, "viewParticipants")) {
    operationItems.push({
      label: "Operations Dashboard",
      href: `/events/${eventId}/operations`,
      icon: BarChart3,
      exact: true,
    });
  }

  if (can(role, "checkInParticipants")) {
    operationItems.push({
      label: "Participants & Check-in",
      href: `/events/${eventId}/operations/participants`,
      icon: ClipboardCheck,
    });
  }

  if (operationItems.length > 0) {
    sections.push({
      title: "OPERATIONS",
      items: operationItems,
    });
  }

  return sections;
}

function SidebarLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavigationItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;

  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
        "text-sm font-medium transition-colors",
        "motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#93c6f9] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[#0b3048]",
        isActive
          ? "bg-[#3b5a72] text-white"
          : "text-white/75 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarContent({
  role,
  pathname,
  eventId,
  onNavigate,
}: SidebarContentProps) {
  const sections = getEventSections(eventId, role);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Brand */}
      <div className="border-b border-white/10 px-5 py-6">
        <Link
          href="/events"
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#226a9a]">
            <CalendarDays className="size-5 text-white" />
          </div>

          <div className="min-w-0">
            <p className="text-base font-semibold tracking-tight">
              BCC EventOps
            </p>
            <p className="text-[10px] font-medium tracking-[0.16em] text-[#c0e0ff]">
              EVENT MANAGEMENT
            </p>
          </div>
        </Link>
      </div>

      {/* Event navigation */}
      <nav
        aria-label="Event workspace navigation"
        className="min-h-0 flex-1 space-y-6 overflow-y-auto px-3 py-6"
      >
        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="px-3 text-[10px] font-semibold tracking-[0.16em] text-[#93c6f9]">
              {section.title}
            </h2>

            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </section>
        ))}
      </nav>

      {/* Event role */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#3b5a72]">
            <ShieldCheck className="size-5 text-white" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {EVENT_ROLE_LABELS[role]}
            </p>
            <p className="text-xs text-[#c0e0ff]">Event role</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({
  role,
  eventId,
  pathname,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close event navigation"
          onClick={onMobileClose}
          className="fixed inset-x-0 top-[108px] bottom-0 z-30 bg-[#0b3048]/30 lg:hidden"
        />
      )}

      {/* Desktop sidebar */}
      <aside
        aria-label="Event workspace sidebar"
        className="sticky top-0 hidden h-screen w-[263px] shrink-0 flex-col bg-[#0b3048] text-white lg:flex"
      >
        <SidebarContent role={role} pathname={pathname} eventId={eventId} />
      </aside>

      {/* Mobile sidebar */}
      <aside
        id="mobile-app-navigation"
        aria-label="Mobile event navigation"
        hidden={!mobileOpen}
        className="fixed bottom-0 left-0 top-[108px] z-40 w-[min(84vw,300px)] bg-[#0b3048] text-white shadow-2xl lg:hidden"
      >
        <SidebarContent
          role={role}
          pathname={pathname}
          eventId={eventId}
          onNavigate={onMobileClose}
        />
      </aside>
    </>
  );
}
