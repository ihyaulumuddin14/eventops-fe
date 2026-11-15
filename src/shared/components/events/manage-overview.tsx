
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  ListOrdered,
  Megaphone,
  Pencil,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { PREVIEW_ROLE } from "@/shared/lib/preview-session";

gsap.registerPlugin(useGSAP);

type ManagementCard = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  icon: LucideIcon;
  access: string;
};

function ManagementCardLink({ card }: { card: ManagementCard }) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      data-manage-card
      className={[
        "group flex min-h-[230px] flex-col rounded-2xl p-5",
        "border border-[#e2e8f0] bg-white",
        "shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
        "transition-[transform,border-color,box-shadow] duration-200",
        "hover:-translate-y-0.5 hover:border-[#c0cbd6]",
        "hover:shadow-[0_4px_12px_rgba(15,23,42,0.07)]",
        "motion-reduce:transition-none motion-reduce:hover:transform-none",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#226a9a] focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#e9f2fe] text-[#00517d]">
          <Icon className="size-5" aria-hidden="true" />
        </div>

        <ArrowUpRight className="size-5 text-[#94a3b8] transition-colors group-hover:text-[#00517d]" />
      </div>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
        {card.eyebrow}
      </p>

      <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#0b3048]">
        {card.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#526273]">
        {card.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#edf0f3] pt-4">
        <span className="text-xs font-medium text-[#64748b]">
          {card.access}
        </span>

        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#00517d]">
          Open
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function ManageOverview({ eventId }: { eventId: string }) {
    const containerRef = useRef<HTMLElement>(null);

    const normalizedRole = PREVIEW_ROLE.toLowerCase();

    const isCoordinator = normalizedRole === "coordinator";
    const isCommittee = normalizedRole === "committee";

    const hasManagementAccess = isCoordinator || isCommittee;

    const roleLabel = isCoordinator
    ? "Koordinator"
    : isCommittee
        ? "Panitia"
        : "Peserta";

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        "[data-manage-card]",
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

  const cards: ManagementCard[] = [
    ...(isCoordinator
      ? [
          {
            title: "Event Settings",
            eyebrow: "Event configuration",
            description:
              "Update event information, location, schedule, status, and participant capacity.",
            href: `/events/${eventId}/manage/edit`,
            icon: Pencil,
            access: "Coordinator",
          },
        ]
      : []),

    {
      title: "Sessions",
      eyebrow: "Program & rundown",
      description: isCoordinator
        ? "Create and organize the event rundown, edit session details, and track session progress."
        : "Review the rundown and update session status as the event progresses.",
      href: `/events/${eventId}/manage/sessions`,
      icon: ListOrdered,
      access: "Coordinator & Panitia",
    },

    {
      title: "Committee",
      eyebrow: "People & access",
      description: isCoordinator
        ? "Invite team members, manage committee roles, and review pending invitations."
        : "View active committee members and manage your own committee membership.",
      href: `/events/${eventId}/manage/committee`,
      icon: Users,
      access: "Coordinator & Panitia",
    },

    {
      title: "Announcements",
      eyebrow: "Event communication",
      description:
        "Create, edit, and publish important updates for event participants.",
      href: `/events/${eventId}/manage/announcements`,
      icon: Megaphone,
      access: "Coordinator & Panitia",
    },
  ];

  if (!hasManagementAccess) {
    return (
      <main
        ref={containerRef}
        className="min-h-full bg-[#f8fafc]"
      >
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#e9f2fe] text-[#00517d]">
              <ShieldCheck className="size-6" />
            </div>

            <h1 className="mt-4 text-xl font-semibold text-[#0b3048]">
              Management access required
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#526273]">
              Only active Coordinators and Staff members can access this
              management workspace.
            </p>

            <Link
              href={`/events/${eventId}`}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#00517d] px-5 text-sm font-semibold text-white hover:bg-[#226a9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2"
            >
              Return to event
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      className="min-h-full bg-[#f8fafc]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-8 sm:px-8 lg:px-12 2xl:px-16">

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#64748b]"
        >
          <Link
            href="/events"
            className="hover:text-[#00517d]"
          >
            Event Catalog
          </Link>

          <span aria-hidden="true">/</span>

          <Link
            href={`/events/${eventId}`}
            className="hover:text-[#00517d]"
          >
            Event Overview
          </Link>

          <span aria-hidden="true">/</span>

          <span className="text-[#00517d]" aria-current="page">
            Manage
          </span>
        </nav>

        {/* Page heading */}
        <div className="mt-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00517d]">
              Event Workspace
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0b3048] sm:text-4xl">
              Manage Event
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526273] sm:text-base">
              Configure your event, organize its sessions, and keep
              your team informed.
            </p>

            <p className="mt-3 text-xs text-[#64748b]">
              Event reference:{" "}
              <code className="rounded-md bg-[#e9eef3] px-2 py-1 font-mono text-[#334155]">
                {eventId}
              </code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#cbd8e3] bg-white px-3 text-sm font-medium text-[#334155]">
              <ShieldCheck className="size-4 text-[#00517d]" />
              {roleLabel}
            </span>

            <Link
              href={`/events/${eventId}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#00517d] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#226a9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2"
            >
              View Event
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Management sections */}
        <section
          aria-labelledby="management-heading"
          className="mt-10"
        >
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
                Management
              </p>

              <h2
                id="management-heading"
                className="mt-1 text-xl font-semibold tracking-tight text-[#0b3048]"
              >
                Manage event resources
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Choose an area to configure and manage.
              </p>
            </div>

            <span className="text-xs font-medium text-[#64748b]">
              {cards.length} available sections
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <ManagementCardLink
                key={card.title}
                card={card}
              />
            ))}
          </div>
        </section>

        {/* Operations is a separate workspace */}
        <section
          aria-labelledby="operations-heading"
          className="mt-9"
        >
          <div className="flex flex-col gap-4 rounded-2xl border border-[#d8e3eb] bg-[#eef4f8] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#d8e3eb] bg-white text-[#00517d]">
                <ClipboardCheck className="size-5" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                  Separate workspace
                </p>

                <h2
                  id="operations-heading"
                  className="mt-1 text-lg font-semibold text-[#0b3048]"
                >
                  Live Operations
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-[#526273]">
                  Monitor attendance, search participants, and
                  manage event check-in.
                </p>
              </div>
            </div>

            <Link
              href={`/events/${eventId}/operations`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#c0cbd6] bg-white px-4 text-sm font-semibold text-[#00517d] transition-colors hover:border-[#93c6f9] hover:bg-[#f8fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2"
            >
              Open Operations
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
