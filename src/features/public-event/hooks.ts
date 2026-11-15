"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/shared/lib/api-client";
import { createEvent } from "./api";

export const useCreateEvent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.dismiss();
      toast.success("Event berhasil dibuat");
      router.replace("/events");
    },

    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Terjadi kesalahan sistem",
      );
    },
  });
};