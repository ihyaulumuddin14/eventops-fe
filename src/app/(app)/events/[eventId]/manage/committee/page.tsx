import { Suspense } from "react";
import { CommitteeManagement } from "@/shared/components/events/committee-management";

type CommitteePageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

function CommitteeLoading() {
  return (
    <main className="min-h-[60vh] bg-[#f9f9f9] px-4 py-16 text-center">
      <output className="text-sm text-[#64748b]" aria-live="polite">
        Loading committee...
      </output>
    </main>
  );
}

async function CommitteeContent({ params }: CommitteePageProps) {
  const { eventId } = await params;

  return <CommitteeManagement eventId={eventId} />;
}

export default function CommitteeEventPage({ params }: CommitteePageProps) {
  return (
    <Suspense fallback={<CommitteeLoading />}>
      <CommitteeContent params={params} />
    </Suspense>
  );
}
