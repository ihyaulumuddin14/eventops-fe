import { EventCatalog } from "@/shared/components/events/event-catalog";
import { PREVIEW_ROLE } from "@/shared/lib/preview-session";

export default function EventsPage() {
  return <EventCatalog role={PREVIEW_ROLE} />;
}
