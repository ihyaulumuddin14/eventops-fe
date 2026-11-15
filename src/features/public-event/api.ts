import { apiRequest } from "@/shared/lib/api-client";
import type { SuccessResponse } from "@/shared/types/type";
import type { CreateEventInput } from "./schema/event.schema";
import type { Event } from "./types";

export async function createEvent(
  data: CreateEventInput,
): Promise<SuccessResponse<Event>> {
  return apiRequest<SuccessResponse<Event>>("/events", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      date: new Date(data.date).toISOString(),
      available_quota: data.max_quota,
    }),
  });
}