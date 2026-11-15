"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Mail,
  Megaphone,
  Pencil,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/features/auth/hooks";
import type { EventRole } from "@/shared/lib/event-permissions";
import { can } from "@/shared/lib/event-permissions";

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
  mobileOpen: boolean;
  onMobileClose: () => void;
};

type SidebarContentProps = {
  role: EventRole;
  pathname: string;
  eventId: string | null;
  onNavigate?: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
};

const generalItems: NavigationItem[] = [
  {
    label: "Event Catalog",
    href: "/events",
    icon: CalendarDays,
    exact: true,
  },
  {
    label: "My Registrations",
    href: "/my-registrations",
    icon: Ticket,
    exact: true,
  },
  {
    label: "Invitations",
    href: "/invitations",
    icon: Mail,
    exact: true,
  },
];

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
  onLogout,
  isLoggingOut,
}: SidebarContentProps) {
  const sections: NavigationSection[] = [
    {
      title: "GENERAL",
      items: generalItems,
    },
    ...(eventId ? getEventSections(eventId, role) : []),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
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

      <nav
        aria-label="Main navigation"
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

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className={[
            "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5",
            "text-sm font-medium text-white/75 transition-colors",
            "hover:bg-white/10 hover:text-[#ffb4ab]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[#93c6f9]",
            "motion-reduce:transition-none",
          ].join(" ")}
        >
          <LogOut className="size-[18px] shrink-0" aria-hidden="true" />

          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </button>
      </div>
    </div>
  );
}

export function AppSidebar({
  role,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  const pathname = usePathname() ?? "/";
  const matchedEventId = pathname.match(/^\/events\/([^/]+)(?:\/|$)/)?.[1];
  const eventId =
    matchedEventId && matchedEventId !== "create" ? matchedEventId : null;

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[263px] shrink-0 flex-col bg-[#0b3048] text-white lg:flex">
        <SidebarContent
          role={role}
          pathname={pathname}
          eventId={eventId}
          onLogout={handleLogout}
          isLoggingOut={logout.isPending}
        />
      </aside>

      <aside
        id="mobile-app-navigation"
        aria-label="Mobile navigation"
        hidden={!mobileOpen}
        className="fixed inset-y-16 left-0 z-40 w-[min(84vw,300px)] bg-[#0b3048] text-white shadow-2xl lg:hidden"
      >
        <SidebarContent
          role={role}
          pathname={pathname}
          eventId={eventId}
          onNavigate={onMobileClose}
          onLogout={handleLogout}
          isLoggingOut={logout.isPending}
        />
      </aside>
    </>
  );
}
