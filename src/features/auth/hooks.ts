
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { clearAccessToken, setAccessToken } from "@/shared/lib/token";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../auth/api";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      toast.dismiss();
      toast.success("Register berhasil");
    },

    onError: (_error) => {
      toast.error("Terjadi kesalahan sistem");
    },
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (response) => {
      const { access_token, user } = response.data;

      setAccessToken(access_token);
      queryClient.setQueryData(["users"], user);

      toast.dismiss();
      toast.success("Login berhasil");

      router.replace("/");
    },

    onError: (error) => {
      toast.error(error.message || "Terjadi kesalahan sistem");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      toast.dismiss();
      toast.success("Logout berhasil");

      router.replace("/");
      router.refresh();
    },

    onError: () => {
      toast.error("Terjadi kesalahan sistem");
    },

    onSettled: () => {
      queryClient.clear();
      clearAccessToken();
    },
  });
};
