import type { ReactNode } from "react";
import { AppShell } from "@/shared/components/layout/app-shell";
import type { EventRole } from "@/shared/lib/event-permissions";

// TEMPORARY
const previewRole: EventRole = "coordinator";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell role={previewRole}>{children}</AppShell>;
}
