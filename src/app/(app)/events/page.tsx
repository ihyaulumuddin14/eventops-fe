import { EventCatalog } from "@/features/public-event/components/EventCatalog";
import Footer from "@/shared/components/Footer";
import Navbar from "@/shared/components/Navbar";

const PREVIEW_ROLE = "coordinator" as const;

export default function EventsPage() {
  return (
    <div className="w-full min-h-screen relative flex flex-col items-center pt-24">
      <Navbar />
      <EventCatalog role={PREVIEW_ROLE} />
      <Footer />
    </div>
  );
}
