"use server";
import { forgotPassword, getCustomer, register } from "@/services/customers";
import {
  RegisterFormSchema,
  ForgotPasswordFormSchema,
  LoginFormSchema,
} from "@/lib/validation";
import { login } from "@/services/customers";
import { createSession, deleteSession, getToken } from "@/lib/session";
import { getHeaders } from "@/lib";
import { z } from "zod";
import { redirect, RedirectType } from "next/navigation";
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

export async function useGetCustomer() {
  try {
    const headers = await getHeaders();
    const token = (await getToken()) || "";
    const { data } = await getCustomer(token, headers);
    return { isAuthenticated: true, customer: data };
  } catch (error: any) {
    const message: string = error.message;
    if (message.includes("Invalid token")) {
      redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    return { isAuthenticated: false, customer: undefined };
  }
}
