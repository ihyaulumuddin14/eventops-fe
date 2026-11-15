"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  DEMO_SESSIONS,
  type DemoSession as Session,
  type DemoSessionStatus as SessionStatus,
} from "@/shared/constant/DEMOEVENTDETAIL";
import { PREVIEW_ROLE } from "@/shared/lib/preview-session";

gsap.registerPlugin(useGSAP);

// type SessionStatus = "upcoming" | "ongoing" | "finished";
type StatusFilter = "all" | SessionStatus;

// type Session = {
//   id: string;
//   title: string;
//   description: string;
//   speaker: string;
//   location: string;
//   startAt: string;
//   endAt: string;
//   status: SessionStatus;
// };

// const DEMO_SESSIONS: Session[] = [
//   {
//     id: "session-1",
//     title: "Registration & Networking",
//     description: "Participant registration and networking before the event.",
//     speaker: "BCC Committee",
//     location: "Main Lobby",
//     startAt: "2026-11-21T08:00",
//     endAt: "2026-11-21T09:00",
//     status: "finished",
//   },
//   {
//     id: "session-2",
//     title: "Opening Ceremony",
//     description: "Opening remarks and introduction to the event.",
//     speaker: "BCC Coordinator",
//     location: "Main Auditorium",
//     startAt: "2026-11-21T09:00",
//     endAt: "2026-11-21T09:30",
//     status: "ongoing",
//   },
//   {
//     id: "session-3",
//     title: "Introduction to Modern Web Development",
//     description:
//       "An introduction to modern frontend architecture and development.",
//     speaker: "Guest Speaker",
//     location: "Main Auditorium",
//     startAt: "2026-11-21T09:30",
//     endAt: "2026-11-21T11:00",
//     status: "upcoming",
//   },
//   {
//     id: "session-4",
//     title: "Coffee Break",
//     description: "Networking and refreshments.",
//     speaker: "BCC Committee",
//     location: "Hallway",
//     startAt: "2026-11-21T11:00",
//     endAt: "2026-11-21T11:30",
//     status: "upcoming",
//   },
// ];

const SESSION_SCHEMA = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must contain at least 3 characters.")
      .max(100),
    description: z.string().trim().max(500),
    speaker: z.string().trim().min(2, "Speaker is required.").max(100),
    location: z.string().trim().min(2, "Location is required.").max(120),
    startAt: z.string().min(1, "Start time is required."),
    endAt: z.string().min(1, "End time is required."),
  })
  .superRefine((value, context) => {
    const start = Date.parse(value.startAt);
    const end = Date.parse(value.endAt);

    if (!Number.isFinite(start)) {
      context.addIssue({
        code: "custom",
        path: ["startAt"],
        message: "Invalid start time.",
      });
    }

    if (!Number.isFinite(end)) {
      context.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "Invalid end time.",
      });
    }

    if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
      context.addIssue({
        code: "custom",
        path: ["endAt"],
        message: "End time must be after start time.",
      });
    }
  });

type SessionFormValues = z.infer<typeof SESSION_SCHEMA>;

const EMPTY_FORM: SessionFormValues = {
  title: "",
  description: "",
  speaker: "",
  location: "",
  startAt: "",
  endAt: "",
};

const STATUS_CONFIG: Record<SessionStatus, { label: string; classes: string }> =
  {
    upcoming: {
      label: "Upcoming",
      classes: "bg-[#e9f2fe] text-[#00517d] border-[#c9dff2]",
    },
    ongoing: {
      label: "Ongoing",
      classes: "bg-[#c5fed4] text-[#0d572c] border-[#b4e8c5]",
    },
    finished: {
      label: "Finished",
      classes: "bg-[#eeeeee] text-[#41474f] border-[#dedfe2]",
    },
  };

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All sessions", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Finished", value: "finished" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}

function getNextStatus(status: SessionStatus): SessionStatus | null {
  if (status === "upcoming") return "ongoing";
  if (status === "ongoing") return "finished";
  return null;
}

export function SessionsManagement({ eventId }: { eventId: string }) {
  const containerRef = useRef<HTMLElement>(null);

  const isCoordinator = PREVIEW_ROLE === "coordinator";
  const canAccess =
    PREVIEW_ROLE === "coordinator" || PREVIEW_ROLE === "committee";

  const [sessions, setSessions] = useState<Session[]>(DEMO_SESSIONS);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SessionFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const counts = useMemo(
    () => ({
      total: sessions.length,
      upcoming: sessions.filter((item) => item.status === "upcoming").length,
      ongoing: sessions.filter((item) => item.status === "ongoing").length,
      finished: sessions.filter((item) => item.status === "finished").length,
    }),
    [sessions],
  );

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sessions
      .filter((session) => {
        const matchesStatus =
          activeFilter === "all" || session.status === activeFilter;

        const matchesSearch = [session.title, session.speaker, session.location]
          .join(" ")
          .toLowerCase()
          .includes(query);

        return matchesStatus && matchesSearch;
      })
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      );
  }, [sessions, search, activeFilter]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        "[data-session-card]",
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [filteredSessions.length],
      revertOnUpdate: true,
    },
  );

  function updateField(field: keyof SessionFormValues, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setFormOpen(true);
  }

  function openEditForm(session: Session) {
    setEditingId(session.id);
    setForm({
      title: session.title,
      description: session.description,
      speaker: session.speaker,
      location: session.location,
      startAt: session.startAt,
      endAt: session.endAt,
    });
    setErrors({});
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = SESSION_SCHEMA.safeParse(form);

    if (!result.success) {
      const nextErrors = result.error.issues.reduce<Record<string, string>>(
        (accumulator, issue) => {
          const field = String(issue.path[0] ?? "form");
          if (!accumulator[field]) {
            accumulator[field] = issue.message;
          }
          return accumulator;
        },
        {},
      );

      setErrors(nextErrors);
      return;
    }

    if (editingId) {
      setSessions((previous) =>
        previous.map((session) =>
          session.id === editingId ? { ...session, ...result.data } : session,
        ),
      );
    } else {
      setSessions((previous) => [
        {
          id: crypto.randomUUID(),
          ...result.data,
          status: "upcoming",
        },
        ...previous,
      ]);
    }

    closeForm();
  }

  function handleDelete(session: Session) {
    const confirmed = window.confirm(
      `Delete "${session.title}"? This demo action cannot be undone.`,
    );

    if (!confirmed) return;

    setSessions((previous) =>
      previous.filter((item) => item.id !== session.id),
    );
  }

  function updateStatus(id: string, status: SessionStatus) {
    setSessions((previous) =>
      previous.map((session) =>
        session.id === id ? { ...session, status } : session,
      ),
    );
  }

  if (!canAccess) {
    return (
      <main className="min-h-full bg-[#f9f9f9] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e2e2e2] bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-[#0b3048]">
            Management access required
          </h1>
          <p className="mt-2 text-sm text-[#526273]">
            Only active Coordinators and Panitia can access session management.
          </p>
          <Link
            href={`/events/${eventId}/manage`}
            className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#226a9a] px-5 text-sm font-semibold text-white"
          >
            Back to Manage
          </Link>
        </div>
      </main>
    );
  }

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
          <Link
            href={`/events/${eventId}/manage`}
            className="hover:text-[#00517d]"
          >
            Manage
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-[#00517d]">
            Sessions
          </span>
        </nav>

        {/* Header */}
        <div className="mt-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00517d]">
              Program & Rundown
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0b3048] sm:text-4xl">
              Sessions
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526273]">
              Organize your event schedule and keep track of session progress.
            </p>
          </div>

          {isCoordinator && (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#226a9a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#00517d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2"
            >
              <Plus className="size-4" />
              Add Session
            </button>
          )}
        </div>

        {/* Demo notice */}
        <div className="mt-6 rounded-xl border border-[#c9dff2] bg-[#e9f2fe] px-4 py-3 text-sm text-[#00517d]">
          <strong>Preview mode:</strong> Session data is currently mocked.
          Changes are temporary and will not persist after reloading.
        </div>

        {/* Summary */}
        <section
          aria-label="Session summary"
          className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
            { label: "Total Sessions", value: counts.total },
            { label: "Upcoming", value: counts.upcoming },
            { label: "Ongoing", value: counts.ongoing },
            { label: "Finished", value: counts.finished },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#e2e2e2] bg-white p-4"
            >
              <p className="text-xs font-medium text-[#64748b]">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-[#0b3048]">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Search and filters */}
        <section
          aria-label="Search and filter sessions"
          className="mt-6 rounded-2xl border border-[#e2e2e2] bg-white p-4 sm:p-5"
        >
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search session, speaker, or location..."
                aria-label="Search sessions"
                className="h-11 w-full rounded-xl border border-[#c0c7d0] bg-white pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-[#717880] focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
              />
            </div>

            <fieldset className="flex min-w-0 gap-2 overflow-x-auto border-0 p-0 pb-1 lg:pb-0">
              <legend className="sr-only">Filter by session status</legend>
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={activeFilter === filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={[
                    "min-h-10 shrink-0 rounded-xl px-3.5 text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a]",
                    activeFilter === filter.value
                      ? "bg-[#226a9a] text-white"
                      : "bg-[#f3f3f4] text-[#42627c] hover:bg-[#e8e8e8]",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              ))}
            </fieldset>
          </div>

          <p className="mt-3 border-t border-[#eeeeee] pt-3 text-xs text-[#64748b]">
            Showing{" "}
            <strong className="text-[#0b3048]">
              {filteredSessions.length}
            </strong>{" "}
            of {sessions.length} sessions
          </p>
        </section>

        {/* Create / edit form */}
        {formOpen && isCoordinator && (
          <section
            aria-labelledby="session-form-heading"
            className="mt-6 rounded-2xl border border-[#c0c7d0] bg-white p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#00517d]">
                  Session details
                </p>
                <h2
                  id="session-form-heading"
                  className="mt-1 text-xl font-semibold text-[#0b3048]"
                >
                  {editingId ? "Edit Session" : "Create Session"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close session form"
                className="flex size-9 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f3f3f4]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="session-title"
                    className="mb-1.5 block text-sm font-medium text-[#2c4558]"
                  >
                    Session title
                  </label>
                  <input
                    id="session-title"
                    value={form.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-[#c0c7d0] px-3 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                    placeholder="e.g. Introduction to Web Development"
                    aria-invalid={Boolean(errors.title)}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-[#b83d00]">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="session-description"
                    className="mb-1.5 block text-sm font-medium text-[#2c4558]"
                  >
                    Description
                  </label>
                  <textarea
                    id="session-description"
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    rows={3}
                    className="w-full rounded-xl border border-[#c0c7d0] p-3 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                    placeholder="Describe what this session is about..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="session-speaker"
                    className="mb-1.5 block text-sm font-medium text-[#2c4558]"
                  >
                    Speaker / Person in charge
                  </label>
                  <input
                    id="session-speaker"
                    value={form.speaker}
                    onChange={(event) =>
                      updateField("speaker", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-[#c0c7d0] px-3 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                    placeholder="Speaker name"
                    aria-invalid={Boolean(errors.speaker)}
                  />
                  {errors.speaker && (
                    <p className="mt-1 text-xs text-[#b83d00]">
                      {errors.speaker}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="session-location"
                    className="mb-1.5 block text-sm font-medium text-[#2c4558]"
                  >
                    Location
                  </label>
                  <input
                    id="session-location"
                    value={form.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-[#c0c7d0] px-3 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                    placeholder="Room or venue"
                    aria-invalid={Boolean(errors.location)}
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs text-[#b83d00]">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="session-start"
                    className="mb-1.5 block text-sm font-medium text-[#2c4558]"
                  >
                    Start time
                  </label>
                  <input
                    id="session-start"
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(event) =>
                      updateField("startAt", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-[#c0c7d0] px-3 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                    aria-invalid={Boolean(errors.startAt)}
                  />
                  {errors.startAt && (
                    <p className="mt-1 text-xs text-[#b83d00]">
                      {errors.startAt}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="session-end"
                    className="mb-1.5 block text-sm font-medium text-[#2c4558]"
                  >
                    End time
                  </label>
                  <input
                    id="session-end"
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(event) =>
                      updateField("endAt", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-[#c0c7d0] px-3 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                    aria-invalid={Boolean(errors.endAt)}
                  />
                  {errors.endAt && (
                    <p className="mt-1 text-xs text-[#b83d00]">
                      {errors.endAt}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-[#eeeeee] pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="min-h-11 rounded-xl border border-[#c0c7d0] px-5 text-sm font-medium text-[#42627c] hover:bg-[#f3f3f4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-11 rounded-xl bg-[#226a9a] px-5 text-sm font-semibold text-white hover:bg-[#00517d]"
                >
                  {editingId ? "Save Changes" : "Create Session"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Sessions list */}
        <section aria-labelledby="rundown-heading" className="mt-8">
          <div className="mb-4">
            <h2
              id="rundown-heading"
              className="text-xl font-semibold text-[#0b3048]"
            >
              Event Rundown
            </h2>
            <p className="mt-1 text-sm text-[#64748b]">
              Sessions are automatically displayed in chronological order.
            </p>
          </div>

          {filteredSessions.length > 0 ? (
            <div className="space-y-3">
              {filteredSessions.map((session, index) => {
                const status = STATUS_CONFIG[session.status];
                const nextStatus = getNextStatus(session.status);

                return (
                  <article
                    key={session.id}
                    data-session-card
                    aria-labelledby={`session-${session.id}`}
                    className="rounded-2xl border border-[#e2e2e2] bg-white p-5 transition-colors duration-200 hover:border-[#c0c7d0] sm:p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f3f4] text-sm font-semibold text-[#42627c]">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.classes}`}
                            >
                              <span className="size-1.5 rounded-full bg-current" />
                              {status.label}
                            </span>
                          </div>

                          <h3
                            id={`session-${session.id}`}
                            className="mt-2 text-base font-semibold tracking-tight text-[#0b3048] sm:text-lg"
                          >
                            {session.title}
                          </h3>

                          {session.description && (
                            <p className="mt-1 text-sm leading-6 text-[#64748b]">
                              {session.description}
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#526273]">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-4 text-[#00517d]" />
                              {formatDate(session.startAt)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 className="size-4 text-[#00517d]" />
                              {formatTime(session.startAt)} –{" "}
                              {formatTime(session.endAt)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="size-4 text-[#00517d]" />
                              {session.speaker}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="size-4 text-[#00517d]" />
                              {session.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-[#eeeeee] pt-4 lg:border-0 lg:pt-0">
                        {isCoordinator ? (
                          <>
                            <label
                              className="sr-only"
                              htmlFor={`status-${session.id}`}
                            >
                              Update status for {session.title}
                            </label>
                            <select
                              id={`status-${session.id}`}
                              value={session.status}
                              onChange={(event) =>
                                updateStatus(
                                  session.id,
                                  event.target.value as SessionStatus,
                                )
                              }
                              className="min-h-10 rounded-lg border border-[#c0c7d0] bg-white px-3 text-xs font-medium text-[#42627c] outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="ongoing">Ongoing</option>
                              <option value="finished">Finished</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => openEditForm(session)}
                              aria-label={`Edit ${session.title}`}
                              className="flex size-10 items-center justify-center rounded-lg border border-[#c0c7d0] text-[#42627c] transition-colors hover:bg-[#f3f3f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a]"
                            >
                              <Pencil className="size-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(session)}
                              aria-label={`Delete ${session.title}`}
                              className="flex size-10 items-center justify-center rounded-lg border border-[#e7c9c5] text-[#b83d00] transition-colors hover:bg-[#ffedeb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83d00]"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={!nextStatus}
                            onClick={() => {
                              if (nextStatus) {
                                updateStatus(session.id, nextStatus);
                              }
                            }}
                            className="min-h-10 rounded-lg border border-[#c0c7d0] px-3 text-xs font-semibold text-[#00517d] transition-colors hover:bg-[#e9f2fe] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {nextStatus === "ongoing"
                              ? "Start session"
                              : nextStatus === "finished"
                                ? "Finish session"
                                : "Completed"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#c0c7d0] bg-white px-5 text-center">
              <CalendarDays className="size-8 text-[#64748b]" />
              <h3 className="mt-3 text-lg font-semibold text-[#0b3048]">
                No sessions found
              </h3>
              <p className="mt-1 text-sm text-[#64748b]">
                Try changing your search or status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-3 rounded-lg px-4 py-2 text-sm font-semibold text-[#00517d] hover:bg-[#e9f2fe]"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
