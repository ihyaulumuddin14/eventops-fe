// features/event/components/EventRegisterDialog.tsx
"use client";

import { ArrowRight, CalendarDays, Check, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { CatalogEvent } from "@/shared/constant/DEMOEVENTS";
import { useAccessToken } from "@/shared/lib/token";

// import { useRegisterEvent } from "../hooks";

type Props = {
  event: CatalogEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isRegistered: boolean;
  onRegistered: () => void;
};

export function EventRegisterDialog({
  event,
  open,
  onOpenChange,
  isRegistered,
}: Props) {
  const router = useRouter();
  const isLoggedIn = !!useAccessToken();
  // const { mutate, isPending } = useRegisterEvent();

  const isFinished = event.status === "finished";
  const isFull = event.registered >= event.capacity;
  const isPending = false; // Placeholder for mutation state

  const handleRegister = () => {
    if (!isLoggedIn) {
      router.push(`/login?callback=/events`);
      return;
    }

    // mutate(String(event.id), { onSuccess: onRegistered });
  };

  // Satu sumber kebenaran buat label + disabled
  const button = isRegistered
    ? {
        label: "Registered",
        disabled: true,
        icon: <Check className="size-4" />,
      }
    : isFinished
      ? { label: "Registration closed", disabled: true, icon: null }
      : isFull
        ? { label: "Quota full", disabled: true, icon: null }
        : isPending
          ? {
              label: "Registering...",
              disabled: true,
              icon: <Loader2 className="size-4 animate-spin" />,
            }
          : {
              label: isLoggedIn ? "Register" : "Login to register",
              disabled: false,
              icon: null,
            };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="sm:max-w-md">
        <DialogHeader className="mt-7">
          <DialogTitle className="text-xl font-bold text-[#0b3048]">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-5 text-[#41474f]">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 rounded-xl border border-[#dcecff] bg-[#f8fbff] p-4 text-[13px]">
          <div className="flex items-start gap-2.5 text-[#2c4558]">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#00517d]" />
            <span>
              {event.date} · {event.time}
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-[#41474f]">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#00517d]" />
            <span>{event.location}</span>
          </div>
          <p className="pt-1 text-[#41474f]">
            <strong className="text-[#0b3048]">{event.registered}</strong> /{" "}
            {event.capacity} participants
          </p>
        </div>

        <DialogFooter className="gap-2 sm:flex-col sm:space-x-0">
          <button
            type="button"
            onClick={handleRegister}
            disabled={button.disabled}
            className={[
              "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#226a9a] focus-visible:ring-offset-2",
              isRegistered
                ? "cursor-not-allowed bg-[#e9f2fe] text-[#00517d]"
                : button.disabled
                  ? "cursor-not-allowed bg-[#eeeeee] text-[#717880]"
                  : "bg-[#226a9a] text-white hover:bg-[#00517d]",
            ].join(" ")}
          >
            {button.icon}
            {button.label}
          </button>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-[#00517d] hover:bg-[#e9f2fe]"
          >
            View full details
            <ArrowRight className="size-4" />
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
