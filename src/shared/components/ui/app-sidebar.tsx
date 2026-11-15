"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  ListOrdered,
  Mail,
  Megaphone,
  Pencil,
  Plus,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  primary?: boolean;
};

type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

type SidebarLinkProps = {
  item: NavigationItem;
  pathname: string;
  compact?: boolean;
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

function SidebarLink({ item, pathname, compact = false }: SidebarLinkProps) {
  const Icon = item.icon;

  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const baseClasses = compact
    ? "flex w-max shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
    : "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium";

  const stateClasses = item.primary
    ? "text-white shadow-sm"
    : isActive
      ? "text-white"
      : "text-white/75 hover:bg-white/10 hover:text-white";

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      title={item.label}
      style={
        item.primary
          ? { backgroundColor: "var(--bcc-civic-blue, #226a9a)" }
          : isActive
            ? { backgroundColor: "var(--bcc-sidebar-active, #3b5a72)" }
            : undefined
      }
      className={[
        baseClasses,
        stateClasses,
        "transition-colors motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#93c6f9] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[#0b3048]",
      ].join(" ")}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname() ?? "/";

  // Detect whether the user is currently inside an event workspace.
  const eventMatch = pathname.match(/^\/events\/([^/]+)(?:\/|$)/);
  const eventId = eventMatch?.[1];

  // /events/create is not an existing event workspace.
  const isEventWorkspace = Boolean(eventId && eventId !== "create");

  const createEventItem: NavigationItem = {
    label: "Create Event",
    href: "/events/create",
    icon: Plus,
    exact: true,
    primary: true,
  };

  const eventSections: NavigationSection[] = isEventWorkspace
    ? [
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
        {
          title: "MANAGEMENT",
          items: [
            {
              label: "Edit Event",
              href: `/events/${eventId}/manage/edit`,
              icon: Pencil,
              exact: true,
            },
            {
              label: "Sessions",
              href: `/events/${eventId}/manage/sessions`,
              icon: ListOrdered,
            },
            {
              label: "Committee",
              href: `/events/${eventId}/manage/committee`,
              icon: Users,
              exact: true,
            },
            {
              label: "Announcements",
              href: `/events/${eventId}/manage/announcements`,
              icon: Megaphone,
              exact: true,
            },
          ],
        },
        {
          title: "OPERATIONS",
          items: [
            {
              label: "Operations Dashboard",
              href: `/events/${eventId}/operations`,
              icon: BarChart3,
              exact: true,
            },
            {
              label: "Participants & Check-in",
              href: `/events/${eventId}/operations/participants`,
              icon: ClipboardCheck,
            },
          ],
        },
      ]
    : [];

  const sections: NavigationSection[] = [
    {
      title: "GENERAL",
      items: generalItems,
    },
    ...eventSections,
  ];

  const mobileItems = [
    createEventItem,
    ...generalItems,
    ...eventSections.flatMap((section) => section.items),
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        aria-label="Application sidebar"
        className="sticky top-0 hidden h-screen w-[263px] shrink-0 flex-col bg-[#0b3048] text-white lg:flex"
      >
        {/* Brand */}
        <div className="border-b border-white/10 px-5 py-6">
          <Link href="/events" className="flex items-center gap-3">
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

        {/* Create event */}
        <div className="px-4 pt-5">
          <SidebarLink item={createEventItem} pathname={pathname} />
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 space-y-6 overflow-y-auto px-3 py-6"
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
                  />
                ))}
              </div>
            </section>
          ))}
        </nav>

        {/* Role indicator */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#3b5a72]">
              <ShieldCheck className="size-5 text-white" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Koordinator</p>
              <p className="text-xs text-[#c0e0ff]">Event role</p>
            </div>

            <span
              className="ml-auto size-2 shrink-0 rounded-full bg-[#c5fed4]"
              aria-hidden="true"
            />
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#0b3048] text-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/events" className="flex items-center gap-2">
            <CalendarDays className="size-5" />
            <span className="font-semibold">BCC EventOps</span>
          </Link>

          <span className="rounded-full bg-[#3b5a72] px-3 py-1 text-xs font-medium">
            Koordinator
          </span>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-2"
        >
          {mobileItems.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              pathname={pathname}
              compact
            />
          ))}
        </nav>
      </div>
    </>
  );
}
