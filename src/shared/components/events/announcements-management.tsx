"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowLeft,
  Bell,
  Crown,
  Megaphone,
  Pencil,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { PREVIEW_ROLE } from "@/shared/lib/preview-session";

gsap.registerPlugin(useGSAP);

type ManagementRole = "coordinator" | "committee";

type Announcement = {
  id: string;
  event_id: string;
  title: string;
  body: string;
  sender: {
    id: string;
    email: string;
  };
};

type AnnouncementDraft = {
  title: string;
  body: string;
};

type FormErrors = Partial<Record<keyof AnnouncementDraft, string>>;

const EMPTY_DRAFT: AnnouncementDraft = {
  title: "",
  body: "",
};

const ANNOUNCEMENT_SCHEMA = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Announcement title is required.")
    .max(120, "Title cannot exceed 120 characters."),
  body: z
    .string()
    .trim()
    .min(1, "Announcement content is required.")
    .max(3000, "Content cannot exceed 3000 characters."),
});

// Preview data only. This does not represent persisted backend data.
const INITIAL_ANNOUNCEMENTS: Omit<Announcement, "event_id">[] = [
  {
    id: "announcement-1",
    title: "Welcome to BCC Event 2026!",
    body: "Welcome everyone! We're excited to have you joining us.\n\nPlease keep an eye on this announcement board for important updates regarding the event.",
    sender: {
      id: "user-1",
      email: "nadia@bcc.id",
    },
  },
  {
    id: "announcement-2",
    title: "Registration and Check-in Information",
    body: "Participants are encouraged to arrive early. Please prepare your registration confirmation and student identification card during check-in.",
    sender: {
      id: "user-1",
      email: "nadia@bcc.id",
    },
  },
  {
    id: "announcement-3",
    title: "Event Preparation Update",
    body: "The committee is currently preparing the event venue and technical equipment. Further information will be shared through this announcement board.",
    sender: {
      id: "user-2",
      email: "raka@bcc.id",
    },
  },
];

function RoleBadge({ role }: { role: ManagementRole }) {
  const isCoordinator = role === "coordinator";
  const Icon = isCoordinator ? Crown : Users;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9dff2] bg-[#e9f2fe] px-3 py-1.5 text-xs font-semibold text-[#00517d]">
      <Icon className="size-3.5" aria-hidden="true" />
      {isCoordinator ? "Koordinator" : "Panitia"}
    </span>
  );
}

function AnnouncementCard({
  announcement,
  isLatest,
  onEdit,
  onDelete,
  confirmingDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  announcement: Announcement;
  isLatest: boolean;
  onEdit: () => void;
  onDelete: () => void;
  confirmingDelete: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  return (
    <article
      data-announcement-card
      className="rounded-2xl border border-[#e2e2e2] bg-white p-5 transition-colors hover:border-[#c0c7d0] sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f2fe] text-[#00517d]">
            <Megaphone className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#0b3048]">
              {announcement.sender.email}
            </p>
            <p className="mt-0.5 text-xs text-[#64748b]">Announcement author</p>
          </div>

          {isLatest && (
            <span className="shrink-0 rounded-full bg-[#c5fed4] px-2.5 py-1 text-[10px] font-semibold text-[#0d572c]">
              Latest
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-[#eeeeee] pt-3 sm:border-0 sm:pt-0">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#c0c7d0] px-3 text-xs font-semibold text-[#42627c] transition-colors hover:border-[#226a9a] hover:bg-[#e9f2fe] hover:text-[#00517d] sm:flex-none"
          >
            <Pencil className="size-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${announcement.title}`}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-[#e7c9c5] text-[#b83d00] transition-colors hover:bg-[#ffedeb]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 border-t border-[#eeeeee] pt-5">
        <h3 className="text-lg font-semibold leading-snug tracking-tight text-[#0b3048]">
          {announcement.title}
        </h3>

        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#526273]">
          {announcement.body}
        </p>
      </div>

      {confirmingDelete && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#e7c9c5] bg-[#ffedeb] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-[#93000a]">
            Are you sure you want to delete this announcement?
          </p>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onCancelDelete}
              className="min-h-9 rounded-lg border border-[#c0c7d0] bg-white px-3 text-xs font-semibold text-[#42627c]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirmDelete}
              className="min-h-9 rounded-lg bg-[#b83d00] px-3 text-xs font-semibold text-white hover:bg-[#93000a]"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export function AnnouncementsManagement({ eventId }: { eventId: string }) {
  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    INITIAL_ANNOUNCEMENTS.map((announcement) => ({
      ...announcement,
      event_id: eventId,
    })),
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AnnouncementDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isCoordinator = PREVIEW_ROLE === "coordinator";
  const isCommittee = PREVIEW_ROLE === "committee";
  const hasManagementAccess = isCoordinator || isCommittee;

  const roleLabel = isCoordinator ? "Koordinator" : "Panitia";

  useEffect(() => {
    if (formOpen && editingId) {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [formOpen, editingId]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        "[data-announcement-card]",
        {
          autoAlpha: 0,
          y: 10,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.06,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [announcements.length],
      revertOnUpdate: true,
    },
  );

  function openCreateForm() {
    if (formOpen && !editingId) {
      setFormOpen(false);
      return;
    }

    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setFormOpen(true);
  }

  function openEditForm(announcement: Announcement) {
    setEditingId(announcement.id);
    setDraft({
      title: announcement.title,
      body: announcement.body,
    });
    setErrors({});
    setFeedback("");
    setConfirmDeleteId(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = ANNOUNCEMENT_SCHEMA.safeParse(draft);

    if (!result.success) {
      const nextErrors: FormErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === "title" || field === "body") {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    if (editingId) {
      setAnnouncements((previous) =>
        previous.map((announcement) =>
          announcement.id === editingId
            ? {
                ...announcement,
                title: result.data.title,
                body: result.data.body,
              }
            : announcement,
        ),
      );

      setFeedback("Announcement updated in preview mode.");
    } else {
      const newAnnouncement: Announcement = {
        id: crypto.randomUUID(),
        event_id: eventId,
        title: result.data.title,
        body: result.data.body,
        sender: {
          id: "preview-current-user",
          email: "you@bcc.id",
        },
      };

      setAnnouncements((previous) => [newAnnouncement, ...previous]);

      setFeedback("Announcement created in preview mode.");
    }

    closeForm();
  }

  function handleDelete(announcementId: string) {
    setAnnouncements((previous) =>
      previous.filter((announcement) => announcement.id !== announcementId),
    );

    setConfirmDeleteId(null);
    setFeedback("Announcement deleted in preview mode.");
  }

  if (!hasManagementAccess) {
    return (
      <main ref={containerRef} className="min-h-full bg-[#f9f9f9] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e2e2e2] bg-white p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#e9f2fe] text-[#00517d]">
            <ShieldCheck className="size-6" />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-[#0b3048]">
            Management access required
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#526273]">
            Only active Coordinators and Panitia members can manage
            announcements.
          </p>

          <Link
            href={`/events/${eventId}`}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#226a9a] px-5 text-sm font-semibold text-white hover:bg-[#00517d]"
          >
            <ArrowLeft className="size-4" />
            Return to Event
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
            Announcements
          </span>
        </nav>

        {/* Header */}
        <div className="mt-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00517d]">
              Event Communication
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0b3048] sm:text-4xl">
              Announcements
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526273]">
              Share important information and keep everyone updated throughout
              your event.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RoleBadge role={isCoordinator ? "coordinator" : "committee"} />

            <button
              type="button"
              onClick={openCreateForm}
              aria-expanded={formOpen}
              aria-controls="announcement-composer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#226a9a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#00517d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2"
            >
              {formOpen && !editingId ? (
                <X className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              {formOpen && !editingId ? "Close Composer" : "New Announcement"}
            </button>
          </div>
        </div>

        {/* Preview notice */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#c9dff2] bg-[#e9f2fe] px-4 py-3">
          <Bell className="mt-0.5 size-4 shrink-0 text-[#00517d]" />

          <p className="text-sm leading-6 text-[#00517d]">
            <strong>Preview mode:</strong> Announcements use temporary mock
            data. Changes will reset after reloading the page.
          </p>
        </div>

        {/* Feedback */}
        {feedback && (
          <output
            aria-live="polite"
            className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#c9dff2] bg-white px-4 py-3 text-sm text-[#00517d]"
          >
            <span>{feedback}</span>

            <button
              type="button"
              onClick={() => setFeedback("")}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Dismiss
            </button>
          </output>
        )}

        {/* Composer */}
        {formOpen && (
          <div
            id="announcement-composer"
            ref={formRef}
            className="mt-7 scroll-mt-6 rounded-2xl border border-[#c0c7d0] bg-white p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#00517d]">
                  {editingId ? "Edit announcement" : "New announcement"}
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#0b3048]">
                  {editingId
                    ? "Update your announcement"
                    : "What would you like to announce?"}
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#64748b]">
                  Provide a clear title and message for your event participants.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close announcement form"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#64748b] transition-colors hover:bg-[#f3f3f4] hover:text-[#0b3048]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="announcement-title"
                    className="text-sm font-semibold text-[#2c4558]"
                  >
                    Announcement Title
                  </label>

                  <span className="text-xs text-[#64748b] tabular-nums">
                    {draft.title.length}/120
                  </span>
                </div>

                <input
                  id="announcement-title"
                  type="text"
                  value={draft.title}
                  maxLength={120}
                  onChange={(event) => {
                    setDraft((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }));
                    setErrors((previous) => ({
                      ...previous,
                      title: undefined,
                    }));
                  }}
                  placeholder="e.g. Important event schedule update"
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={
                    errors.title ? "announcement-title-error" : undefined
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-[#c0c7d0] bg-white px-4 text-sm text-[#1a1c1c] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                />

                {errors.title && (
                  <p
                    id="announcement-title-error"
                    className="mt-1.5 text-xs text-[#b83d00]"
                  >
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="announcement-body"
                    className="text-sm font-semibold text-[#2c4558]"
                  >
                    Announcement Content
                  </label>

                  <span className="text-xs text-[#64748b] tabular-nums">
                    {draft.body.length}/3000
                  </span>
                </div>

                <textarea
                  id="announcement-body"
                  value={draft.body}
                  maxLength={3000}
                  rows={7}
                  onChange={(event) => {
                    setDraft((previous) => ({
                      ...previous,
                      body: event.target.value,
                    }));
                    setErrors((previous) => ({
                      ...previous,
                      body: undefined,
                    }));
                  }}
                  placeholder="Write your announcement here..."
                  aria-invalid={Boolean(errors.body)}
                  aria-describedby={
                    errors.body ? "announcement-body-error" : undefined
                  }
                  className="mt-2 w-full resize-y rounded-xl border border-[#c0c7d0] bg-white px-4 py-3 text-sm leading-7 text-[#1a1c1c] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                />

                {errors.body && (
                  <p
                    id="announcement-body-error"
                    className="mt-1.5 text-xs text-[#b83d00]"
                  >
                    {errors.body}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col-reverse justify-end gap-3 border-t border-[#eeeeee] pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={closeForm}
                  className="min-h-11 rounded-xl border border-[#c0c7d0] bg-white px-5 text-sm font-semibold text-[#42627c] transition-colors hover:bg-[#f3f3f4]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#226a9a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#00517d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2"
                >
                  <Send className="size-4" />
                  {editingId ? "Save Changes" : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Announcement list */}
        <section aria-labelledby="announcement-list-heading" className="mt-9">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]">
                Communication Feed
              </p>

              <h2
                id="announcement-list-heading"
                className="mt-1 text-xl font-semibold text-[#0b3048]"
              >
                Published Announcements
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Important updates shared with event participants.
              </p>
            </div>

            <span className="text-xs font-medium text-[#64748b]">
              {announcements.length}{" "}
              {announcements.length === 1 ? "announcement" : "announcements"}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  isLatest={index === 0}
                  onEdit={() => openEditForm(announcement)}
                  onDelete={() => {
                    setConfirmDeleteId(announcement.id);
                    setFeedback("");
                  }}
                  confirmingDelete={confirmDeleteId === announcement.id}
                  onConfirmDelete={() => handleDelete(announcement.id)}
                  onCancelDelete={() => setConfirmDeleteId(null)}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#c0c7d0] bg-white px-5 py-14 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#e9f2fe] text-[#00517d]">
                  <Megaphone className="size-6" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-[#0b3048]">
                  No announcements yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#64748b]">
                  Keep your participants informed by publishing your first event
                  announcement.
                </p>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#226a9a] px-4 text-sm font-semibold text-white hover:bg-[#00517d]"
                >
                  <Plus className="size-4" />
                  Create Announcement
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Permission information */}
        <div className="mt-9 flex items-start gap-3 rounded-xl border border-[#e2e2e2] bg-white p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#00517d]" />

          <div>
            <p className="text-sm font-semibold text-[#0b3048]">
              {roleLabel} access
            </p>

            <p className="mt-1 text-sm leading-6 text-[#64748b]">
              Announcement management is available to active Coordinators and
              Panitia members. All announcement changes in this preview are
              temporary.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
