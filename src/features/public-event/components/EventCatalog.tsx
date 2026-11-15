"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DEMO_EVENTS } from "@/shared/constant/DEMOEVENTS";
import type { EventRole } from "@/shared/lib/event-permissions";
import { canCreateEvent } from "@/shared/lib/event-permissions";
import { EventStatus } from "../types";
import EventCard from "./EventCard";

type StatusFilter = "all" | EventStatus;

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All Events", value: "all" },
  { label: "Upcoming", value: EventStatus.UPCOMING },
  { label: "Ongoing", value: EventStatus.ONGOING },
  { label: "Finished", value: EventStatus.FINISHED },
];

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

            <div
              // aria-label="Filter by event status"
              className="flex gap-2 overflow-x-auto pb-1 lg:pb-0"
            >
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
            </div>
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
    </div>
  );
}
