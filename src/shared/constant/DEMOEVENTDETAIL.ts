export type DemoSessionStatus = "upcoming" | "ongoing" | "finished";

export type DemoSession = {
  id: string;
  title: string;
  description: string;
  speaker: string;
  location: string;
  startAt: string;
  endAt: string;
  status: DemoSessionStatus;
};

export const DEMO_SESSIONS: DemoSession[] = [
  {
    id: "session-1",
    title: "Registration & Networking",
    description: "Participant registration and networking before the event.",
    speaker: "BCC Committee",
    location: "Main Lobby",
    startAt: "2026-11-21T08:00",
    endAt: "2026-11-21T09:00",
    status: "finished",
  },
  {
    id: "session-2",
    title: "Opening Ceremony",
    description: "Opening remarks and introduction to the event.",
    speaker: "BCC Coordinator",
    location: "Main Auditorium",
    startAt: "2026-11-21T09:00",
    endAt: "2026-11-21T09:30",
    status: "ongoing",
  },
  {
    id: "session-3",
    title: "Introduction to Modern Web Development",
    description:
      "An introduction to modern frontend architecture and development.",
    speaker: "Guest Speaker",
    location: "Main Auditorium",
    startAt: "2026-11-21T09:30",
    endAt: "2026-11-21T11:00",
    status: "upcoming",
  },
  {
    id: "session-4",
    title: "Coffee Break",
    description: "Networking and refreshments.",
    speaker: "BCC Committee",
    location: "Hallway",
    startAt: "2026-11-21T11:00",
    endAt: "2026-11-21T11:30",
    status: "upcoming",
  },
];

export type DemoAnnouncement = {
  id: string;
  event_id: string;
  title: string;
  body: string;
  sender: {
    id: string;
    email: string;
  };
};

type DemoAnnouncementSeed = Omit<DemoAnnouncement, "event_id">;

const DEMO_ANNOUNCEMENTS: DemoAnnouncementSeed[] = [
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

export function createDemoAnnouncements(eventId: string): DemoAnnouncement[] {
  return DEMO_ANNOUNCEMENTS.map((announcement) => ({
    ...announcement,
    event_id: eventId,
  }));
}
