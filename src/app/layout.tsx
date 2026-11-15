import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "@/shared/providers/query-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BCC EventOps",
    template: "%s | BCC EventOps",
  },
  description:
    "Platform terpadu untuk mengelola kegiatan dan operasional event BCC.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} min-h-full antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
