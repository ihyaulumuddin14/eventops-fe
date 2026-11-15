"use client";

import {
  Archive,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  MapPin,
  Search,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { EventRole } from "@/shared/lib/event-permissions";
import { canCreateEvent } from "@/shared/lib/event-permissions";

type EventStatus = "upcoming" | "ongoing" | "finished";
type StatusFilter = "all" | EventStatus;

type CatalogEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: EventStatus;
  date: string;
  time: string;
  location: string;
  registered: number;
  capacity: number;
};

// DEMO ONLY: Replace these fixtures with Go BE event data.
const DEMO_EVENTS: CatalogEvent[] = [
  {
    id: "tech-summit-2026",
    title: "BCC Tech Summit 2026",
    description:
      "Annual technology symposium focusing on autonomous UI agents, system scalability, and emerging technologies.",
    category: "Summit",
    status: "ongoing",
    date: "Saturday, 14 Mar 2026",
    time: "08:30 - 17:00 WIB",
    location: "Auditorium Gedung Filkom UB & Zoom Hybrid",
    registered: 482,
    capacity: 500,
  },
  {
    id: "workshop-web-development",
    title: "Workshop Web Development: Next.js 15 & Tailwind",
    description:
      "Hands-on practical development workshop exploring server components, streaming, and modern UI architecture.",
    category: "Workshop",
    status: "upcoming",
    date: "Wednesday, 25 Mar 2026",
    time: "13:00 - 16:30 WIB",
    location: "Lab Komputer Terapan 2, Lantai 3 Filkom",
    registered: 65,
    capacity: 100,
  },
  {
    id: "bcc-open-house-2026",
    title: "BCC Open House 2026",
    description:
      "Introductory orientation showcase for prospective members, presenting division activities and community programs.",
    category: "Showcase",
    status: "upcoming",
    date: "Saturday, 28 Mar 2026",
    time: "09:00 - 14:00 WIB",
    location: "Gedung Samantha Krida, Universitas Brawijaya",
    registered: 180,
    capacity: 300,
  },
  {
    id: "upgrading-bcc",
    title: "Upgrading BCC: Leadership & Project Governance",
    description:
      "Internal leadership enhancement retreat for newly inducted division leads, focusing on governance and collaboration.",
    category: "Internal",
    status: "upcoming",
    date: "Sunday, 5 Apr 2026",
    time: "08:00 - 16:00 WIB",
    location: "Ruang Seminar H1.6 Gedung Filkom UB",
    registered: 42,
    capacity: 60,
  },
  {
    id: "ui-ux-masterclass",
    title: "UI/UX Masterclass: Advanced Design Tokens",
    description:
      "Deep dive session on multi-tier semantic design tokens, automated Figma sync, and scalable design systems.",
    category: "Masterclass",
    status: "finished",
    date: "Saturday, 28 Feb 2026",
    time: "10:00 - 15:30 WIB",
    location: "Daring via Google Meet",
    registered: 120,
    capacity: 120,
  },
  {
    id: "product-management-bootcamp",
    title: "Product Management Bootcamp: From Discovery to Launch",
    description:
      "Structured framework exploration on user discovery interviews, PRD drafting, metrics, and product delivery.",
    category: "Bootcamp",
    status: "finished",
    date: "Saturday, 14 Feb 2026",
    time: "09:00 - 16:00 WIB",
    location: "Auditorium Gedung F, Lantai 2 Filkom",
    registered: 85,
    capacity: 85,
  },
];

const STATUS_CONFIG: Record<
  EventStatus,
  { label: string; badge: string; progress: string }
> = {
  upcoming: {
    label: "Upcoming",
    badge: "border-[#c9dff2] bg-[#e9f2fe] text-[#00517d]",
    progress: "bg-[#226a9a]",
  },
  ongoing: {
    label: "Ongoing",
    badge: "border-[#b4e8c5] bg-[#c5fed4] text-[#0d572c]",
    progress: "bg-[#226a9a]",
  },
  finished: {
    label: "Finished",
    badge: "border-[#dedfe2] bg-[#e8e8e8] text-[#41474f]",
    progress: "bg-[#4b718e]",
  },
};

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All Events", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Finished", value: "finished" },
];

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function EventCard({ event }: { event: CatalogEvent }) {
  const config = STATUS_CONFIG[event.status];
  const isFinished = event.status === "finished";

  const remaining = Math.max(event.capacity - event.registered, 0);

  const percentage =
    event.capacity > 0
      ? Math.min(
          100,
          Math.round((event.registered / event.capacity) * 1000) / 10,
        )
      : 0;

  const metricLabel = isFinished ? "Attendance" : "Participants";

  const progressLabel = isFinished
    ? "Attended"
    : event.status === "ongoing"
      ? "Booked"
      : "Filled";

  return (
    <article
      className={[
        "flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl",
        "border border-[#e2e8f0] bg-white",
        "shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-[#c0cbd6]",
        "hover:shadow-[0_4px_12px_rgba(15,23,42,0.07)]",
        "motion-reduce:transition-none motion-reduce:hover:transform-none",
      ].join(" ")}
    >
      {/* Event heading */}
      <div className="flex-1 p-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full border",
              "px-3 py-1 text-[11px] font-semibold",
              config.badge,
            ].join(" ")}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {config.label}
          </span>

          <span className="shrink-0 rounded bg-[#f3f3f4] px-2 py-1 text-[11px] font-medium text-[#41474f]">
            {event.category}
          </span>
        </div>

        <h2 className="mt-3 min-h-[3.25rem] text-lg font-bold leading-6 tracking-tight text-[#0b3048]">
          {event.title}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-[13px] leading-5 text-[#41474f]">
          {event.description}
        </p>
      </div>

      {/* Date and location */}
      <div className="space-y-2 border-y border-[#dcecff] bg-[#f8fbff] px-5 py-3">
        <div className="flex items-start gap-2.5 text-[13px] text-[#2c4558]">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#00517d]" />
          <span className="min-w-0 break-words leading-5">
            {event.date} · {event.time}
          </span>
        </div>

        <div className="flex items-start gap-2.5 text-[13px] text-[#41474f]">
          <MapPin className="mt-0.5 size-4 shrink-0 text-[#00517d]" />
          <span className="min-w-0 break-words leading-5">
            {event.location}
          </span>
        </div>
      </div>

      {/* Participant quota */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <div className="flex items-center justify-between gap-2 text-[13px]">
          <span className="font-medium text-[#41474f]">{metricLabel}</span>

          <span className="tabular-nums text-[#1a1c1c]">
            <strong className="font-semibold text-[#0b3048]">
              {formatNumber(event.registered)}
            </strong>
            {" / "}
            {formatNumber(event.capacity)}
          </span>
        </div>

        <div
          role="progressbar"
          aria-label={`${metricLabel}: ${event.registered} of ${event.capacity}`}
          aria-valuemin={0}
          aria-valuemax={event.capacity}
          aria-valuenow={event.registered}
          className="mt-2 h-2 overflow-hidden rounded-full bg-[#eeeeee]"
        >
          <div
            className={`h-full rounded-full ${config.progress}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span
            className={[
              "inline-flex items-center gap-1 font-semibold",
              isFinished ? "text-[#41474f]" : "text-[#00517d]",
            ].join(" ")}
          >
            {isFinished ? (
              <CalendarCheck className="size-3.5" />
            ) : event.status === "ongoing" ? (
              <Zap className="size-3.5" />
            ) : (
              <Users className="size-3.5" />
            )}

            {isFinished
              ? "Quota filled • Event concluded"
              : `${formatNumber(remaining)} seats remaining`}
          </span>

          <span className="text-[#41474f]">
            {percentage}% {progressLabel}
          </span>
        </div>

        {/* Card action */}
        <div className="mt-auto pt-6">
          <Link
            href={`/events/${event.id}`}
            aria-label={`${isFinished ? "View archive" : "View details"}: ${event.title}`}
            className={[
              "flex min-h-11 w-full items-center justify-center gap-2",
              "rounded-xl border text-sm font-medium",
              "transition-colors motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[#226a9a] focus-visible:ring-offset-2",
              isFinished
                ? "border-[#c0c7d0] text-[#42627c] hover:bg-[#f3f3f4]"
                : "border-[#93c6f9] text-[#00517d] hover:bg-[#e9f2fe]",
            ].join(" ")}
          >
            {isFinished ? "View Archive" : "View Details"}

            {isFinished ? (
              <Archive className="size-4" />
            ) : (
              <ArrowRight className="size-4" />
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}

type EventCatalogProps = {
  role: EventRole;
};

export function EventCatalog({ role }: EventCatalogProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const counts = useMemo(() => {
    return {
      all: DEMO_EVENTS.length,
      upcoming: DEMO_EVENTS.filter((event) => event.status === "upcoming")
        .length,
      ongoing: DEMO_EVENTS.filter((event) => event.status === "ongoing").length,
      finished: DEMO_EVENTS.filter((event) => event.status === "finished")
        .length,
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return DEMO_EVENTS.filter((event) => {
      const matchesStatus =
        activeFilter === "all" || event.status === activeFilter;

      const searchableContent = [
        event.title,
        event.description,
        event.category,
        event.location,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        query.length === 0 || searchableContent.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [search, activeFilter]);

  const showCreateEvent = canCreateEvent(role);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-12 pt-8 sm:px-8 lg:px-12 2xl:px-16">
        {/* Page heading */}
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0b3048] sm:text-4xl">
              Event Catalog
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#41474f] sm:text-base">
              Discover upcoming activities, workshops, and civic summits
              organized by BCC.
            </p>
          </div>

          {showCreateEvent && (
            <Link
              href="/events/create"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#226a9a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00517d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <span className="text-lg leading-none">+</span>
              Create Event
            </Link>
          )}
        </div>

        {/* Search and filters */}
        <section
          aria-label="Search and filter events"
          className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-5"
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#41474f]" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events by name, topic, or venue..."
                aria-label="Search events by name, topic, or venue"
                className="h-11 w-full rounded-xl border border-[#c0c7d0] bg-white pl-10 pr-4 text-sm text-[#1a1c1c] outline-none transition-colors placeholder:text-[#717880] focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
              />
            </div>

            <fieldset className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              <legend className="sr-only">Filter by event status</legend>
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(filter.value)}
                    className={[
                      "inline-flex min-h-10 shrink-0 items-center gap-2",
                      "rounded-xl px-3.5 text-xs font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a]",
                      isActive
                        ? "bg-[#226a9a] text-white"
                        : "bg-[#f3f3f4] text-[#42627c] hover:bg-[#e8e8e8]",
                    ].join(" ")}
                  >
                    {filter.label}

                    <span
                      className={[
                        "rounded-md px-1.5 py-0.5 text-[10px] tabular-nums",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#e2e2e2] text-[#41474f]",
                      ].join(" ")}
                    >
                      {counts[filter.value]}
                    </span>
                  </button>
                );
              })}
            </fieldset>
          </div>

          {/* Event summary */}
          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-[#eeeeee] pt-3 text-[11px] text-[#41474f] sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#0d572c]" />
                {counts.ongoing} Active Operation
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#00517d]" />
                {counts.upcoming} Confirmed Upcoming
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#717880]" />
                {counts.finished} Historical Archives
              </span>
            </div>

            <span className="shrink-0">
              Showing{" "}
              <strong className="text-[#1a1c1c]">
                {filteredEvents.length}
              </strong>{" "}
              of {DEMO_EVENTS.length} institutional events
            </span>
          </div>
        </section>

        {/* Event cards */}
        {filteredEvents.length > 0 ? (
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="mt-7 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#c0c7d0] bg-white px-5 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#e9f2fe] text-[#00517d]">
              <Search className="size-5" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#0b3048]">
              No events found
            </h2>

            <p className="mt-1 text-sm text-[#41474f]">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
              className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-[#00517d] hover:bg-[#e9f2fe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#c0c7d0] bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:px-8 lg:px-12 2xl:px-16">
          <Link
            href="/events"
            className="shrink-0 text-lg font-bold leading-5 tracking-tight text-[#00517d]"
          >
            BCC
            <br />
            EventOps
          </Link>

          <div className="hidden h-8 w-px bg-[#c0c7d0] sm:block" />

          <p className="text-xs leading-5 text-[#41474f] sm:text-sm">
            © 2026 BCC EventOps. Basic Computing Community,
            <br className="hidden sm:block" /> Fakultas Ilmu Komputer,
            Universitas Brawijaya.
          </p>
        </div>
      </footer>
    </div>
  );
}
