import { redirect } from "next/navigation";
import { Suspense } from "react";

async function RedirectToManage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return redirect(`/events/${eventId}/manage`);
}

export default function DetailEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <RedirectToManage params={params} />
    </Suspense>
  );
}
