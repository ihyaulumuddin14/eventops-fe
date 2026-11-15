// features/event/schema/event.schema.ts
import { z } from "zod";
import { EventStatus } from "../types";

export const createEventSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  max_quota: z
    .number({ message: "Kuota harus berupa angka" })
    .int("Kuota harus bilangan bulat")
    .min(1, "Kuota minimal 1"),
  status: z.enum(Object.values(EventStatus) as [EventStatus, ...EventStatus[]]),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;