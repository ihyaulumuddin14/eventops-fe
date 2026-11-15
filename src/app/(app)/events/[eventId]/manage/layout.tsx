import type { ReactNode } from "react";
import { AppShell } from "@/shared/layout/AppShell";
import { PREVIEW_ROLE } from "@/shared/lib/preview-session";

export default function layout({ children }: { children: ReactNode }) {
  return <AppShell role={PREVIEW_ROLE}>{children}</AppShell>;
}
