import { CalendarCheck, CalendarDays, MapPin, Users, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { type CatalogEvent, STATUS_CONFIG } from "@/shared/constant/DEMOEVENTS";
import { EventRegisterDialog } from "./EventRegisterDialog";

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

const EventCard = ({ event }: { event: CatalogEvent }) => {
  const config = STATUS_CONFIG[event.status];
  const isFinished = event.status === "finished";
  const [open, setOpen] = useState(false);
  const remaining = Math.max(event.capacity - event.registered, 0);
  const [registered, setRegistered] = useState(false);
  const percentage =
    event.capacity > 0
      ? Math.min(
          100,
          Math.round((event.registered / event.capacity) * 1000) / 10,
        )
      : 0;

  const metricLabel = isFinished ? "Attendance" : "Participants";

  const progressLabel = isFinished
    ? "Attended"
    : event.status === "ongoing"
      ? "Booked"
      : "Filled";

  return (
    <>
      <article
        className={[
          "flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl",
          "border border-[#e2e8f0] bg-white",
          "shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
          "transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-[#c0cbd6]",
          "hover:shadow-[0_4px_12px_rgba(15,23,42,0.07)]",
          "motion-reduce:transition-none motion-reduce:hover:transform-none",
        ].join(" ")}
      >
        {/* Event heading */}
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full border",
                "px-3 py-1 text-[11px] font-semibold",
                config.badge,
              ].join(" ")}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {config.label}
            </span>

            <span className="shrink-0 rounded bg-[#f3f3f4] px-2 py-1 text-[11px] font-medium text-[#41474f]">
              {event.category}
            </span>
          </div>

          <h2 className="mt-3 min-h-[3.25rem] text-lg font-bold leading-6 tracking-tight text-[#0b3048]">
            {event.title}
          </h2>

          <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-[13px] leading-5 text-[#41474f]">
            {event.description}
          </p>
        </div>

        {/* Date and location */}
        <div className="space-y-2 border-y border-[#dcecff] bg-[#f8fbff] px-5 py-3">
          <div className="flex items-start gap-2.5 text-[13px] text-[#2c4558]">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#00517d]" />
            <span className="min-w-0 break-words leading-5">
              {event.date} · {event.time}
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-[13px] text-[#41474f]">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[#00517d]" />
            <span className="min-w-0 break-words leading-5">
              {event.location}
            </span>
          </div>
        </div>

        {/* Participant quota */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          <div className="flex items-center justify-between gap-2 text-[13px]">
            <span className="font-medium text-[#41474f]">{metricLabel}</span>

            <span className="tabular-nums text-[#1a1c1c]">
              <strong className="font-semibold text-[#0b3048]">
                {formatNumber(event.registered)}
              </strong>
              {" / "}
              {formatNumber(event.capacity)}
            </span>
          </div>

          <div
            role="progressbar"
            aria-label={`${metricLabel}: ${event.registered} of ${event.capacity}`}
            aria-valuemin={0}
            aria-valuemax={event.capacity}
            aria-valuenow={event.registered}
            className="mt-2 h-2 overflow-hidden rounded-full bg-[#eeeeee]"
          >
            <div
              className={`h-full rounded-full ${config.progress}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span
              className={[
                "inline-flex items-center gap-1 font-semibold",
                isFinished ? "text-[#41474f]" : "text-[#00517d]",
              ].join(" ")}
            >
              {isFinished ? (
                <CalendarCheck className="size-3.5" />
              ) : event.status === "ongoing" ? (
                <Zap className="size-3.5" />
              ) : (
                <Users className="size-3.5" />
              )}

              {isFinished
                ? "Quota filled • Event concluded"
                : `${formatNumber(remaining)} seats remaining`}
            </span>

            <span className="text-[#41474f]">
              {percentage}% {progressLabel}
            </span>
          </div>

          {/* Card action */}
          <Button variant="outline" onClick={() => setOpen(true)} className="w-full mt-auto">View Details</Button>
        </div>
      </article>

      <EventRegisterDialog
        event={event}
        open={open}
        onOpenChange={setOpen}
        isRegistered={registered}
        onRegistered={() => setRegistered(true)}
      />
    </>
  );
};

export default EventCard;
