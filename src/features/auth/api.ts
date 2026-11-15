
import { apiRequest } from "@/shared/lib/api-client";
import type { SuccessResponse } from "@/shared/types/type";
import type { LoginFormInput, RegisterFormInput } from "./schema/auth.schema";
import type { User } from "./types";

export async function registerUser(
  data: RegisterFormInput,
): Promise<SuccessResponse<{ access_token: string, user: User }>> {
  return apiRequest<SuccessResponse<{ access_token: string, user: User }>>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  }); 
}

export async function loginUser(
  data: LoginFormInput
): Promise<SuccessResponse<{ access_token: string, user: User }>> {
  return apiRequest<SuccessResponse<{ access_token: string, user: User }>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}
