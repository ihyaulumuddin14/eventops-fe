import { notFound } from "next/navigation";

import { EventDetail } from "@/features/public-event/components/EventDetail";
import { DEMO_EVENTS } from "@/shared/constant/DEMOEVENTS";

type EventDetailPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function DetailEventPage({
  params,
}: EventDetailPageProps) {
  const { eventId } = await params;

  const event = DEMO_EVENTS.find((item) => item.id === eventId);

  if (!event) {
    notFound();
  }

  return <EventDetail event={event} />;
}
