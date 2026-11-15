import type { ReactNode } from "react";
import { AppShell } from "@/shared/layout/AppShell";
import { PREVIEW_ROLE } from "@/shared/lib/preview-session";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppShell role={PREVIEW_ROLE}>{children}</AppShell>;
}
