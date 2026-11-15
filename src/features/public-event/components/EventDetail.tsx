"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Megaphone,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  createDemoAnnouncements,
  DEMO_SESSIONS,
} from "@/shared/constant/DEMOEVENTDETAIL";
import { type CatalogEvent, STATUS_CONFIG } from "@/shared/constant/DEMOEVENTS";
import { EventRegisterDialog } from "./EventRegisterDialog";

gsap.registerPlugin(useGSAP);

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatSessionTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}

export function EventDetail({ event }: { event: CatalogEvent }) {
  const containerRef = useRef<HTMLElement>(null);

  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const announcements = useMemo(
    () => createDemoAnnouncements(event.id),
    [event.id],
  );

  const status = STATUS_CONFIG[event.status];

  const remaining = Math.max(event.capacity - event.registered, 0);

  const percentage =
    event.capacity > 0
      ? Math.min(100, Math.round((event.registered / event.capacity) * 100))
      : 0;

  const registrationDisabled =
    event.status === "finished" || remaining === 0 || isRegistered;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        "[data-detail-section]",
        {
          autoAlpha: 0,
          y: 12,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <main ref={containerRef} className="min-h-full bg-[#f9f9f9]">
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-8 sm:px-8 lg:px-12 2xl:px-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#64748b]"
        >
          <Link href="/events" className="hover:text-[#00517d]">
            Event Catalog
          </Link>

          <span aria-hidden="true">/</span>

          <span aria-current="page" className="text-[#00517d]">
            Event Details
          </span>
        </nav>

        {/* Event header */}
        <section
          data-detail-section
          className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.badge}`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {status.label}
              </span>

              <span className="rounded-md bg-[#f3f3f4] px-2.5 py-1 text-xs font-medium text-[#41474f]">
                {event.category}
              </span>
            </div>

            <h1 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-[#0b3048] sm:text-4xl">
              {event.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#526273]">
              {event.description}
            </p>

            <div className="mt-7 grid gap-4 border-t border-[#eeeeee] pt-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e9f2fe] text-[#00517d]">
                  <CalendarDays className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#64748b]">
                    Event date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0b3048]">
                    {event.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e9f2fe] text-[#00517d]">
                  <Clock3 className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#64748b]">
                    Event time
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0b3048]">
                    {event.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e9f2fe] text-[#00517d]">
                  <MapPin className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#64748b]">Location</p>
                  <p className="mt-1 text-sm font-semibold text-[#0b3048]">
                    {event.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration and capacity */}
          <aside className="flex flex-col rounded-2xl border border-[#e2e8f0] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#0b3048]">
                Event Capacity
              </h2>

              <Users className="size-5 text-[#00517d]" />
            </div>

            <div className="mt-6 flex items-end justify-between gap-2">
              <div>
                <p className="text-3xl font-semibold tabular-nums text-[#0b3048]">
                  {formatNumber(event.registered)}
                </p>
                <p className="mt-1 text-xs text-[#64748b]">
                  Registered participants
                </p>
              </div>

              <p className="pb-1 text-sm font-medium text-[#64748b]">
                / {formatNumber(event.capacity)}
              </p>
            </div>

            <div
              role="progressbar"
              aria-label="Event registration capacity"
              aria-valuemin={0}
              aria-valuemax={event.capacity}
              aria-valuenow={Math.min(event.registered, event.capacity)}
              className="mt-4 h-2 overflow-hidden rounded-full bg-[#eeeeee]"
            >
              <div
                className={`h-full rounded-full transition-[width] duration-500 ${status.progress}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[#00517d]">
                {percentage}% filled
              </span>

              <span className="text-[#64748b]">
                {formatNumber(remaining)} seats remaining
              </span>
            </div>

            <div className="mt-7 border-t border-[#eeeeee] pt-5">
              <p className="text-xs leading-5 text-[#64748b]">
                Secure your place and join this BCC event.
              </p>

              <button
                type="button"
                disabled={registrationDisabled}
                onClick={() => setRegistrationOpen(true)}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#226a9a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#00517d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#e2e2e2] disabled:text-[#717880]"
              >
                {isRegistered
                  ? "Already Registered"
                  : event.status === "finished"
                    ? "Registration Closed"
                    : remaining === 0
                      ? "Event Full"
                      : "Register for Event"}
              </button>
            </div>
          </aside>
        </section>

        {/* Preview notice */}
        <div className="mt-6 rounded-xl border border-[#c9dff2] bg-[#e9f2fe] px-4 py-3 text-sm leading-6 text-[#00517d]">
          <strong>Preview mode:</strong> Rundown and announcements currently use
          shared demo fixtures. Backend integration is not connected yet.
        </div>

        {/* Rundown and announcements */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
          {/* Sessions */}
          <section data-detail-section aria-labelledby="rundown-heading">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#00517d]">
                Event Program
              </p>

              <h2
                id="rundown-heading"
                className="mt-2 text-xl font-semibold text-[#0b3048] sm:text-2xl"
              >
                Event Rundown
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Explore the sessions and activities scheduled for this event.
              </p>
            </div>

            <div className="space-y-3">
              {DEMO_SESSIONS.map((session, index) => {
                const sessionStatus = STATUS_CONFIG[session.status];

                return (
                  <article
                    key={session.id}
                    className="rounded-2xl border border-[#e2e2e2] bg-white p-4 transition-colors hover:border-[#c0c7d0] sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f3f3f4] text-xs font-semibold text-[#42627c]">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${sessionStatus.badge}`}
                          >
                            {sessionStatus.label}
                          </span>
                        </div>

                        <h3 className="mt-2 text-base font-semibold text-[#0b3048]">
                          {session.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-[#64748b]">
                          {session.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#526273]">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 text-[#00517d]" />
                            {formatSessionDate(session.startAt)}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 className="size-3.5 text-[#00517d]" />
                            {formatSessionTime(session.startAt)} –{" "}
                            {formatSessionTime(session.endAt)}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Users className="size-3.5 text-[#00517d]" />
                            {session.speaker}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-[#00517d]" />
                            {session.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Announcements */}
          <section data-detail-section aria-labelledby="announcements-heading">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#00517d]">
                Latest Updates
              </p>

              <h2
                id="announcements-heading"
                className="mt-2 text-xl font-semibold text-[#0b3048] sm:text-2xl"
              >
                Announcements
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Important information and updates from the event committee.
              </p>
            </div>

            <div className="space-y-3">
              {announcements.map((announcement, index) => (
                <article
                  key={announcement.id}
                  className="rounded-2xl border border-[#e2e2e2] bg-white p-5 transition-colors hover:border-[#c0c7d0]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#e9f2fe] text-[#00517d]">
                      <Megaphone className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#0b3048]">
                        {announcement.sender.email}
                      </p>
                      <p className="text-[11px] text-[#64748b]">
                        Event committee
                      </p>
                    </div>

                    {index === 0 && (
                      <span className="rounded-full bg-[#c5fed4] px-2 py-1 text-[10px] font-semibold text-[#0d572c]">
                        Latest
                      </span>
                    )}
                  </div>

                  <div className="mt-4 border-t border-[#eeeeee] pt-4">
                    <h3 className="text-sm font-semibold leading-6 text-[#0b3048]">
                      {announcement.title}
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#526273]">
                      {announcement.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Back navigation */}
        <div className="mt-10 border-t border-[#e2e2e2] pt-6">
          <Link
            href="/events"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#42627c] transition-colors hover:bg-[#eeeeee] hover:text-[#00517d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a]"
          >
            <ArrowLeft className="size-4" />
            Back to Event Catalog
          </Link>
        </div>
      </div>

      <EventRegisterDialog
        event={event}
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
        isRegistered={isRegistered}
        onRegistered={() => setIsRegistered(true)}
      />
    </main>
  );
}
