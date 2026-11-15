import { Suspense } from "react";
import { AnnouncementsManagement } from "@/shared/components/events/announcements-management";

type AnnouncementPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

function AnnouncementLoading() {
  return (
    <main className="min-h-[60vh] bg-[#f9f9f9] px-4 py-16 text-center">
      <output aria-live="polite" className="text-sm text-[#64748b]">
        Loading announcements...
      </output>
    </main>
  );
}

async function AnnouncementContent({ params }: AnnouncementPageProps) {
  const { eventId } = await params;

  return <AnnouncementsManagement key={eventId} eventId={eventId} />;
}

export default function AnnouncementEventPage({
  params,
}: AnnouncementPageProps) {
  return (
    <Suspense fallback={<AnnouncementLoading />}>
      <AnnouncementContent params={params} />
    </Suspense>
  );
}
