export type EventStatus = "upcoming" | "ongoing" | "finished";

export const STATUS_CONFIG: Record<
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

export type CatalogEvent = {
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

export const DEMO_EVENTS: CatalogEvent[] = [
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
