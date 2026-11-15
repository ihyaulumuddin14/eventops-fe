import { Suspense } from "react";
import { SessionsManagement } from "@/shared/components/events/sessions-management";

type SessionsPageProps = {
  params: Promise<{
    eventId: string;
  }>;
};

function SessionsLoading() {
  return (
    <main className="min-h-[60vh] bg-[#f9f9f9] px-4 py-16 text-center">
      <output className="text-sm text-[#64748b]" aria-live="polite">
        Loading sessions...
      </output>
    </main>
  );
}

async function SessionsContent({ params }: SessionsPageProps) {
  const { eventId } = await params;

  return <SessionsManagement eventId={eventId} />;
}

export default function ManageEventSessionsPage({ params }: SessionsPageProps) {
  return (
    <Suspense fallback={<SessionsLoading />}>
      <SessionsContent params={params} />
    </Suspense>
  );
}
