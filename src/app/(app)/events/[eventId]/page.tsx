
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { EventDetail } from "@/features/public-event/components/EventDetail";
import { DEMO_EVENTS } from "@/shared/constant/DEMOEVENTS";

type EventDetailPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

function EventDetailLoading() {
  return (
    <div
      aria-live="polite"
      className="min-h-[60vh] bg-[#f9f9f9] px-4 py-16 text-center text-sm text-[#64748b]"
    >
      Loading event details...
    </div>
  );
}

export default function DetailEventPage({
  params,
}: EventDetailPageProps) {
  return (
    <Suspense fallback={<EventDetailLoading />}>
      <EventDetailContent params={params} />
    </Suspense>
  );
}

async function EventDetailContent({ params }: EventDetailPageProps) {
  const { eventId } = await params;

  const event = DEMO_EVENTS.find((item) => item.id === eventId);

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} />;
}
