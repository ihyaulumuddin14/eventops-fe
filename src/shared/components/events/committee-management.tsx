"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowLeft,
  Crown,
  Mail,
  Search,
  ShieldCheck,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { PREVIEW_ROLE } from "@/shared/lib/preview-session";

gsap.registerPlugin(useGSAP);

type CommitteeRole = "coordinator" | "committee";

type CommitteeMember = {
  id: string;
  email: string;
  role: CommitteeRole;
};

type PendingInvitation = {
  id: string;
  email: string;
  role: CommitteeRole;
  sentLabel: string;
};

const CURRENT_USER_ID = "member-current";

const previewMemberRole: CommitteeRole | null =
  PREVIEW_ROLE === "participant" ? null : PREVIEW_ROLE;

const INITIAL_MEMBERS: CommitteeMember[] = [
  ...(previewMemberRole
    ? [
        {
          id: CURRENT_USER_ID,
          email: "you@bcc.id",
          role: previewMemberRole,
        },
      ]
    : []),
  {
    id: "member-nadia",
    email: "nadia@bcc.id",
    role: "coordinator",
  },
  {
    id: "member-raka",
    email: "raka@bcc.id",
    role: "committee",
  },
  {
    id: "member-sinta",
    email: "sinta@bcc.id",
    role: "committee",
  },
];

const INITIAL_INVITATIONS: PendingInvitation[] = [
  {
    id: "invite-1",
    email: "dimas@bcc.id",
    role: "committee",
    sentLabel: "Today",
  },
  {
    id: "invite-2",
    email: "lina@bcc.id",
    role: "coordinator",
    sentLabel: "Yesterday",
  },
];

const INVITATION_SCHEMA = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  role: z.enum(["coordinator", "committee"]),
});

const ROLE_LABEL: Record<CommitteeRole, string> = {
  coordinator: "Koordinator",
  committee: "Panitia",
};

function RoleBadge({ role }: { role: CommitteeRole }) {
  if (role === "coordinator") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9dff2] bg-[#e9f2fe] px-3 py-1 text-xs font-semibold text-[#00517d]">
        <Crown className="size-3.5" />
        Koordinator
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e2e2e2] bg-[#f3f3f4] px-3 py-1 text-xs font-semibold text-[#42627c]">
      <Users className="size-3.5" />
      Panitia
    </span>
  );
}

function getInitials(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function CommitteeManagement({ eventId }: { eventId: string }) {
  const containerRef = useRef<HTMLElement>(null);

  const [members, setMembers] = useState<CommitteeMember[]>(INITIAL_MEMBERS);

  const [invitations, setInvitations] =
    useState<PendingInvitation[]>(INITIAL_INVITATIONS);

  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<CommitteeRole>("committee");

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [hasLeft, setHasLeft] = useState(false);

  const currentMember = members.find((member) => member.id === CURRENT_USER_ID);

  const currentRole = hasLeft
    ? "participant"
    : (currentMember?.role ?? PREVIEW_ROLE);

  const isCoordinator = currentRole === "coordinator";
  const isCommittee = currentRole === "committee";
  const hasAccess = isCoordinator || isCommittee;

  const coordinatorCount = members.filter(
    (member) => member.role === "coordinator",
  ).length;

  const committeeCount = members.filter(
    (member) => member.role === "committee",
  ).length;

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) =>
      member.email.toLowerCase().includes(query),
    );
  }, [members, search]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        "[data-committee-member]",
        {
          autoAlpha: 0,
          y: 10,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [filteredMembers.length, invitations.length],
      revertOnUpdate: true,
    },
  );

  function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = INVITATION_SCHEMA.safeParse({
      email,
      role: inviteRole,
    });

    if (!result.success) {
      setEmailError(
        result.error.issues[0]?.message ?? "Invalid invitation details.",
      );
      return;
    }

    const normalizedEmail = result.data.email;

    const alreadyMember = members.some(
      (member) => member.email.toLowerCase() === normalizedEmail,
    );

    const alreadyInvited = invitations.some(
      (invitation) => invitation.email.toLowerCase() === normalizedEmail,
    );

    if (alreadyMember || alreadyInvited) {
      setEmailError(
        alreadyMember
          ? "This user is already a committee member."
          : "An invitation for this email is already pending.",
      );
      return;
    }

    setInvitations((previous) => [
      {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        role: result.data.role,
        sentLabel: "Just now",
      },
      ...previous,
    ]);

    setEmail("");
    setEmailError("");
    setFormOpen(false);
    setFeedback("Preview invitation created successfully.");
  }

  function handleChangeRole(member: CommitteeMember, nextRole: CommitteeRole) {
    if (member.role === nextRole) return;

    if (
      member.role === "coordinator" &&
      nextRole === "committee" &&
      coordinatorCount <= 1
    ) {
      setFeedback(
        "This event must have at least one Coordinator. Promote another member first.",
      );
      return;
    }

    setMembers((previous) =>
      previous.map((item) =>
        item.id === member.id ? { ...item, role: nextRole } : item,
      ),
    );

    setFeedback(`${member.email} is now ${ROLE_LABEL[nextRole]}.`);
  }

  function handleRemoveMember(member: CommitteeMember) {
    if (member.id === CURRENT_USER_ID) return;

    if (member.role === "coordinator" && coordinatorCount <= 1) {
      setFeedback("You cannot remove the last Coordinator of this event.");
      return;
    }

    const confirmed = window.confirm(
      `Remove ${member.email} from this committee?`,
    );

    if (!confirmed) return;

    setMembers((previous) => previous.filter((item) => item.id !== member.id));

    setFeedback(`${member.email} has been removed.`);
  }

  function handleCancelInvitation(invitation: PendingInvitation) {
    const confirmed = window.confirm(
      `Cancel the invitation sent to ${invitation.email}?`,
    );

    if (!confirmed) return;

    setInvitations((previous) =>
      previous.filter((item) => item.id !== invitation.id),
    );

    setFeedback("Invitation cancelled in preview mode.");
  }

  function handleLeaveCommittee() {
    if (!currentMember) return;

    if (currentMember.role === "coordinator" && coordinatorCount <= 1) {
      setFeedback(
        "You are the last Coordinator. Assign another Coordinator before leaving.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to leave this committee?",
    );

    if (!confirmed) return;

    setMembers((previous) =>
      previous.filter((member) => member.id !== CURRENT_USER_ID),
    );

    setHasLeft(true);
  }

  if (!hasAccess) {
    return (
      <main ref={containerRef} className="min-h-full bg-[#f9f9f9] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e2e2e2] bg-white p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#e9f2fe] text-[#00517d]">
            <ShieldCheck className="size-6" />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-[#0b3048]">
            Committee access required
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#526273]">
            You are not an active member of this event committee.
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
            Committee
          </span>
        </nav>

        {/* Header */}
        <div className="mt-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00517d]">
              People & Access
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0b3048] sm:text-4xl">
              Committee Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526273]">
              Manage your event committee, coordinate responsibilities, and
              control team membership.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RoleBadge role={currentRole as CommitteeRole} />

            <button
              type="button"
              onClick={handleLeaveCommittee}
              disabled={isCoordinator && coordinatorCount <= 1}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#e2c9c5] bg-white px-4 text-sm font-semibold text-[#b83d00] transition-colors hover:bg-[#ffedeb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <UserMinus className="size-4" />
              Leave Committee
            </button>
          </div>
        </div>

        {/* Preview notice */}
        <div className="mt-6 rounded-xl border border-[#c9dff2] bg-[#e9f2fe] px-4 py-3 text-sm leading-6 text-[#00517d]">
          <strong>Preview mode:</strong> Committee and invitation data are
          mocked. Changes will reset after reloading.
        </div>

        {/* Feedback */}
        {feedback && (
          <output
            aria-live="polite"
            className="mt-4 rounded-xl border border-[#c9dff2] bg-white px-4 py-3 text-sm text-[#00517d]"
          >
            {feedback}
            <button
              type="button"
              onClick={() => setFeedback("")}
              className="ml-3 font-semibold underline underline-offset-2"
            >
              Dismiss
            </button>
          </output>
        )}

        {/* Statistics */}
        <section
          aria-label="Committee statistics"
          className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3"
        >
          {[
            {
              label: "Total Members",
              value: members.length,
              icon: Users,
            },
            {
              label: "Coordinators",
              value: coordinatorCount,
              icon: Crown,
            },
            {
              label: "Committee Members",
              value: committeeCount,
              icon: ShieldCheck,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-[#e2e2e2] bg-white p-4 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#64748b]">
                    {item.label}
                  </p>

                  <Icon className="size-4 text-[#00517d]" />
                </div>

                <p className="mt-3 text-2xl font-semibold tabular-nums text-[#0b3048]">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Members */}
        <section aria-labelledby="members-heading" className="mt-9">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]">
                Team Directory
              </p>

              <h2
                id="members-heading"
                className="mt-1 text-xl font-semibold text-[#0b3048]"
              >
                Active Members
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                People currently assigned to this event.
              </p>
            </div>

            {isCoordinator && (
              <button
                type="button"
                onClick={() => {
                  setFormOpen((previous) => !previous);
                  setEmailError("");
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#226a9a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#00517d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2"
              >
                <UserPlus className="size-4" />
                Invite Member
              </button>
            )}
          </div>

          {/* Invite form */}
          {formOpen && isCoordinator && (
            <form
              onSubmit={handleInvite}
              className="mt-5 rounded-2xl border border-[#c0c7d0] bg-white p-5 sm:p-6"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#00517d]">
                  New Invitation
                </p>

                <h3 className="mt-1 text-lg font-semibold text-[#0b3048]">
                  Invite a registered user
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#64748b]">
                  Enter the email address associated with an existing BCC
                  EventOps account.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
                <div>
                  <label
                    htmlFor="invite-email"
                    className="mb-1.5 block text-sm font-medium text-[#2c4558]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />

                    <input
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setEmailError("");
                      }}
                      placeholder="name@example.com"
                      className="h-11 w-full rounded-xl border border-[#c0c7d0] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={
                        emailError ? "invite-email-error" : undefined
                      }
                    />
                  </div>

                  {emailError && (
                    <p
                      id="invite-email-error"
                      className="mt-1.5 text-xs text-[#b83d00]"
                    >
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="invite-role"
                    className="mb-1.5 block text-sm font-medium text-[#2c4558]"
                  >
                    Assign role
                  </label>

                  <select
                    id="invite-role"
                    value={inviteRole}
                    onChange={(event) =>
                      setInviteRole(event.target.value as CommitteeRole)
                    }
                    className="h-11 w-full rounded-xl border border-[#c0c7d0] bg-white px-3 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
                  >
                    <option value="committee">Panitia</option>
                    <option value="coordinator">Koordinator</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-[#eeeeee] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setEmail("");
                    setEmailError("");
                  }}
                  className="min-h-11 rounded-xl border border-[#c0c7d0] px-5 text-sm font-medium text-[#42627c] hover:bg-[#f3f3f4]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#226a9a] px-5 text-sm font-semibold text-white hover:bg-[#00517d]"
                >
                  <Mail className="size-4" />
                  Send Invitation
                </button>
              </div>
            </form>
          )}

          {/* Search */}
          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#64748b]" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search committee members by email..."
              aria-label="Search committee members"
              className="h-11 w-full rounded-xl border border-[#c0c7d0] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15"
            />
          </div>

          {/* Member list */}
          <div className="mt-4 space-y-3">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <article
                  key={member.id}
                  data-committee-member
                  className="rounded-2xl border border-[#e2e2e2] bg-white p-4 transition-colors hover:border-[#c0c7d0] sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e9f2fe] text-sm font-semibold text-[#00517d]">
                        {getInitials(member.email)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-[#0b3048]">
                            {member.email}
                          </p>

                          {member.id === CURRENT_USER_ID && (
                            <span className="rounded-full bg-[#f3f3f4] px-2 py-0.5 text-[10px] font-semibold text-[#64748b]">
                              You
                            </span>
                          )}
                        </div>

                        <div className="mt-2">
                          <RoleBadge role={member.role} />
                        </div>
                      </div>
                    </div>

                    {isCoordinator && (
                      <div className="flex items-center gap-2 border-t border-[#eeeeee] pt-3 sm:border-0 sm:pt-0">
                        <label
                          htmlFor={`member-role-${member.id}`}
                          className="sr-only"
                        >
                          Change role for {member.email}
                        </label>

                        <select
                          id={`member-role-${member.id}`}
                          value={member.role}
                          onChange={(event) => {
                            const value = event.target.value;

                            if (
                              value === "coordinator" ||
                              value === "committee"
                            ) {
                              handleChangeRole(member, value);
                            }
                          }}
                          className="h-10 min-w-0 flex-1 rounded-lg border border-[#c0c7d0] bg-white px-2 text-xs font-medium text-[#42627c] outline-none focus:border-[#226a9a] focus:ring-2 focus:ring-[#226a9a]/15 sm:flex-none"
                        >
                          <option value="coordinator">Koordinator</option>
                          <option
                            value="committee"
                            disabled={
                              member.role === "coordinator" &&
                              coordinatorCount <= 1
                            }
                          >
                            Panitia
                          </option>
                        </select>

                        {member.id !== CURRENT_USER_ID && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member)}
                            disabled={
                              member.role === "coordinator" &&
                              coordinatorCount <= 1
                            }
                            aria-label={`Remove ${member.email}`}
                            title="Remove member"
                            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#e7c9c5] text-[#b83d00] transition-colors hover:bg-[#ffedeb] disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#c0c7d0] bg-white px-5 py-12 text-center">
                <Users className="mx-auto size-8 text-[#64748b]" />

                <h3 className="mt-3 text-base font-semibold text-[#0b3048]">
                  No members found
                </h3>

                <p className="mt-1 text-sm text-[#64748b]">
                  Try another email address.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pending invitations: Coordinator only */}
        {isCoordinator && (
          <section aria-labelledby="invitations-heading" className="mt-10">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#64748b]">
                  Invitation Tracking
                </p>

                <h2
                  id="invitations-heading"
                  className="mt-1 text-xl font-semibold text-[#0b3048]"
                >
                  Pending Invitations
                </h2>

                <p className="mt-1 text-sm text-[#64748b]">
                  Invitations waiting for a response.
                </p>
              </div>

              <span className="text-xs font-medium text-[#64748b]">
                {invitations.length} pending
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {invitations.length > 0 ? (
                invitations.map((invitation) => (
                  <article
                    key={invitation.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[#e2e2e2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f3f4] text-[#42627c]">
                        <Mail className="size-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0b3048]">
                          {invitation.email}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <RoleBadge role={invitation.role} />

                          <span className="text-xs text-[#64748b]">
                            Sent {invitation.sentLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#eeeeee] pt-3 sm:border-0 sm:pt-0">
                      <span className="inline-flex items-center rounded-full bg-[#fff1dc] px-3 py-1 text-xs font-semibold text-[#805400]">
                        Awaiting response
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCancelInvitation(invitation)}
                        aria-label={`Cancel invitation for ${invitation.email}`}
                        className="inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-[#b83d00] transition-colors hover:bg-[#ffedeb]"
                      >
                        <Trash2 className="size-3.5" />
                        Cancel
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#c0c7d0] bg-white px-5 py-10 text-center">
                  <Mail className="mx-auto size-7 text-[#64748b]" />

                  <p className="mt-3 text-sm font-semibold text-[#0b3048]">
                    No pending invitations
                  </p>

                  <p className="mt-1 text-xs text-[#64748b]">
                    New invitations will appear here.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Panitia information */}
        {isCommittee && (
          <div className="mt-8 rounded-2xl border border-[#c9dff2] bg-[#e9f2fe] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#00517d]" />

              <div>
                <h3 className="text-sm font-semibold text-[#00517d]">
                  Committee member access
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#42627c]">
                  You can view the active committee and your assigned role. Only
                  the event Coordinator can invite members, change roles, or
                  remove committee members.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Last coordinator notice */}
        {isCoordinator && coordinatorCount === 1 && (
          <p className="mt-5 text-xs leading-5 text-[#64748b]">
            You are currently the only Coordinator. Promote another committee
            member before leaving or changing your role.
          </p>
        )}
      </div>
    </main>
  );
}
