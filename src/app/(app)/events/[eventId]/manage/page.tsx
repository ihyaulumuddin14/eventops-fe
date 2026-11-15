
import { ManageOverview } from "@/shared/components/events/manage-overview";

type ManageEventPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

export default async function ManageEventPage({
  params,
}: ManageEventPageProps) {
  const { eventId } = await params;

  return <ManageOverview eventId={eventId} />;
}
