// features/event/components/CreateEventForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCreateEvent } from "../hooks";
import {
  type CreateEventInput,
  createEventSchema,
} from "../schema/event.schema";
import { EventStatus } from "../types";

const STATUS_OPTIONS = [
  { label: "Upcoming", value: EventStatus.UPCOMING },
  { label: "Ongoing", value: EventStatus.ONGOING },
  { label: "Finished", value: EventStatus.FINISHED },
];

export function CreateEventForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      max_quota: undefined,
      status: EventStatus.UPCOMING,
    },
  });

  const { mutate, isPending } = useCreateEvent();

  function onSubmit(data: CreateEventInput) {
    mutate(data);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0b3048]">
          Create Event
        </h1>
        <p className="mt-2 text-sm text-[#41474f]">
          Isi detail event yang akan tampil di katalog.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-6"
      >
        <FieldGroup>
          {/* Title */}
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="title">Judul Event</FieldLabel>
            <Input
              id="title"
              placeholder="Contoh: Workshop Next.js"
              aria-invalid={!!errors.title}
              {...register("title")}
              className="h-12"
            />
            <FieldError errors={[errors.title]} />
          </Field>

          {/* Description */}
          <Field data-invalid={!!errors.description}>
            <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
            <Textarea
              id="description"
              rows={4}
              placeholder="Jelaskan tentang event ini..."
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            <FieldError errors={[errors.description]} />
          </Field>

          {/* Date */}
          <Field data-invalid={!!errors.date}>
            <FieldLabel htmlFor="date">Tanggal & Waktu</FieldLabel>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="date"
                type="datetime-local"
                aria-invalid={!!errors.date}
                {...register("date")}
                className="h-12 pl-10"
              />
            </div>
            <FieldError errors={[errors.date]} />
          </Field>

          {/* Location */}
          <Field data-invalid={!!errors.location}>
            <FieldLabel htmlFor="location">Lokasi</FieldLabel>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Contoh: Gedung F FILKOM UB"
                aria-invalid={!!errors.location}
                {...register("location")}
                className="h-12 pl-10"
              />
            </div>
            <FieldError errors={[errors.location]} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Quota */}
            <Field data-invalid={!!errors.max_quota}>
              <FieldLabel htmlFor="max_quota">Kuota Peserta</FieldLabel>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="max_quota"
                  type="number"
                  min={1}
                  placeholder="100"
                  aria-invalid={!!errors.max_quota}
                  {...register("max_quota", { valueAsNumber: true })}
                  className="h-12 pl-10"
                />
              </div>
              <FieldError errors={[errors.max_quota]} />
            </Field>

            {/* Status */}
            <Field data-invalid={!!errors.status}>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <select
                id="status"
                aria-invalid={!!errors.status}
                {...register("status")}
                className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldError errors={[errors.status]} />
            </Field>
          </div>
        </FieldGroup>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            className="h-12"
            nativeButton={false}
            render={<Link href="/events">Batal</Link>}
          ></Button>

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 bg-sky-700 px-6 text-base hover:bg-sky-800"
          >
            {isPending ? "Menyimpan..." : "Buat Event"}
            {!isPending && <ArrowRight className="ml-1 size-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
