import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "@/shared/providers/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="id" className={`${inter.variable} min-h-full antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
