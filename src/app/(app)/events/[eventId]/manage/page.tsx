import { Suspense } from "react";
import { ManageOverview } from "@/shared/components/events/manage-overview";

type ManageEventPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

function ManageLoading() {
  return (
    <main className="min-h-[60vh] bg-[#f8fafc] px-4 py-16 text-center text-sm text-[#64748b]">
      <output className="block" aria-live="polite">
        Loading management workspace...
      </output>
    </main>
  );
}

async function ManageContent({ params }: ManageEventPageProps) {
  const { eventId } = await params;

  return <ManageOverview eventId={eventId} />;
}

export default function ManageEventPage({ params }: ManageEventPageProps) {
  return (
    <Suspense fallback={<ManageLoading />}>
      <ManageContent params={params} />
    </Suspense>
  );
}
