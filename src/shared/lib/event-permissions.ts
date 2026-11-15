export type EventRole = "coordinator" | "committee" | "participant";

export type EventPermission =
  | "viewEvent"
  | "viewRundown"
  | "viewAnnouncements"
  | "editEvent"
  | "deleteEvent"
  | "manageCommittee"
  | "leaveCommittee"
  | "manageSessions"
  | "updateSessionStatus"
  | "manageAnnouncements"
  | "viewParticipants"
  | "checkInParticipants"
  | "registerForEvent"
  | "viewOwnRegistration"
  | "cancelOtherRegistrations";

export const EVENT_ROLE_LABELS: Record<EventRole, string> = {
  coordinator: "Koordinator",
  committee: "Panitia",
  participant: "Pengguna umum",
};

const ROLE_PERMISSIONS: Record<EventRole, readonly EventPermission[]> = {
  coordinator: [
    "viewEvent",
    "viewRundown",
    "viewAnnouncements",
    "editEvent",
    "deleteEvent",
    "manageCommittee",
    "leaveCommittee",
    "manageSessions",
    "updateSessionStatus",
    "manageAnnouncements",
    "viewParticipants",
    "checkInParticipants",
    "registerForEvent",
    "viewOwnRegistration",
    "cancelOtherRegistrations",
  ],

  committee: [
    "viewEvent",
    "viewRundown",
    "viewAnnouncements",
    "leaveCommittee",
    "updateSessionStatus",
    "manageAnnouncements",
    "viewParticipants",
    "checkInParticipants",
    "registerForEvent",
    "viewOwnRegistration",
  ],

  participant: [
    "viewEvent",
    "viewRundown",
    "viewAnnouncements",
    "registerForEvent",
    "viewOwnRegistration",
  ],
};

export function can(
  role: EventRole | null | undefined,
  permission: EventPermission,
): boolean {
  if (!role) return false;

  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Temporary product assumption:
 * Event creation is restricted to coordinators.
 * Confirm this with the product/backend team.
 */
export function canCreateEvent(role: EventRole | null | undefined): boolean {
  return role === "coordinator";
}
