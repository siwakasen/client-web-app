"use server";
import { CustomerResponse } from "@/_interfaces";
import { forgotPassword, getCustomer, register } from "@/_services/customers";
import {
  RegisterFormSchema,
  ForgotPasswordFormSchema,
  LoginFormSchema,
} from "@/lib/validation";
import { login } from "@/_services/customers";
import { createSession, deleteSession } from "@/lib/session";
import { getHeaders } from "@/lib";
import { unstable_cacheLife as cacheLife } from "next/cache";
import { z } from "zod";

export async function useRegisterUser(
  formData: z.infer<typeof RegisterFormSchema>
) {
  try {
    const headers = await getHeaders();
    const response = await register(formData, headers);
    await createSession(response.data.token);
    return {
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useLoginUser(formData: z.infer<typeof LoginFormSchema>) {
  try {
    const headers = await getHeaders();
    const response = await login(formData, headers);
    await createSession(response.data.token);
    return {
      message: response.data.message || "Login successful!",
    };
  } catch (error: any) {
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useForgotPasswordUser(
  formData: z.infer<typeof ForgotPasswordFormSchema>
) {
  try {
    const headers = await getHeaders();
    const { message } = await forgotPassword(formData, headers);
    return {
      message: message || "Forgot password successful!",
    };
  } catch (error: any) {
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useLogoutUser() {
  await deleteSession();
  return {
    message: "Logout successful!",
  };
}

export async function useGetCustomer(
  token: string,
  headers: Record<string, string>
): Promise<CustomerResponse> {
  "use cache";
  cacheLife("hours");
  return await getCustomer(token, headers);
}
