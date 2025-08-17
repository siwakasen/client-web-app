"use server";
import {
  changePassword,
  forgetPassword,
  getCustomer,
  register,
  uploadIdentityFile,
  login
} from "@/services";
import {
  RegisterFormSchema,
  ForgetPasswordFormSchema,
  LoginFormSchema,
} from "@/lib/validation";
import { ChangePasswordRequest } from "@/interfaces";
import {
  createSession,
  deleteSession,
  getToken,
} from "@/lib/users-provider/cookies";
import { getHeaders } from "@/lib/users-provider";
import { z } from "zod";
import { redirect, RedirectType } from "next/navigation";
import { ErrorResponse } from "./common.hook";
import { revalidateTag, unstable_cache } from "next/cache";
import { headers } from "next/headers";

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
    return ErrorResponse(error);
  }
}

export async function useLoginUser(formData: z.infer<typeof LoginFormSchema>) {

  try {
    const headers = await getHeaders();
    const response = await login(formData, headers);
    await createSession(response.data.token);

    revalidateTag('session');

    return {
      message: response.data.message || "Login successful!",
    };
  } catch (error: any) {
    if (error.code == "ECONNREFUSED") {
      return {
        status: 500,
        errors: {
          message: "Server are not available",
        },
      };
    }
    return ErrorResponse(error);
  }
}

export async function useForgetPasswordUser(
  formData: z.infer<typeof ForgetPasswordFormSchema>
): Promise<{ message?: string; status?: number; errors?: any }> {
  try {
    const headers = await getHeaders();
    const { message } = await forgetPassword(formData, headers);

    return {
      message: message || "Email to reset password sent!",
    };
  } catch (error: any) {
    return ErrorResponse(error);
  }
}

export async function useChangePasswordUser(
  formData: ChangePasswordRequest
): Promise<{ message?: string; status?: number; errors?: any }> {
  try {
    const { message } = await changePassword(formData);
    return { message };
  } catch (error: any) {
    return ErrorResponse(error);
  }
}

export async function useLogoutUser() {
  await deleteSession();
  revalidateTag('session');
  return {
    message: "Logout successful!",
  };
}

export async function useGetCustomer() {
  const headers = await getHeaders();
  const token = (await getToken()) || "";
  if (!token) {
    return { isAuthenticated: false, customer: undefined };
  }
  
  return getCachedCustomer(token, headers);
}

const getCachedCustomer = unstable_cache(async (token: string, headers: Record<string, string>) => {
  try {
    const { data } = await getCustomer(token, headers);
    return { isAuthenticated: true, customer: data };
  } catch (error: any) {
    const message: string = error.message;
    if (
      message.includes("Invalid token") ||
      error.code == "ERR_BAD_REQUEST" ||
      error.code == "ECONNREFUSED" ||
      error.code == "ERR_NETWORK" ||
      error.response?.data.message.includes("Invalid token")
    ) {
      redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    return { isAuthenticated: false, customer: undefined };
  }
}, ['session'], {
  tags: ['session'],
  revalidate: 60 * 60 * 24,
});

export async function useUploadIdentityFile(identityFile: File[]) : Promise<{message: string} | {
  status: number;
  errors: any;
}> {
  try {
    const token = (await getToken()) || "";
    const response = await uploadIdentityFile(identityFile, token);
    return { message: response };
  } catch (error: any) {
    return ErrorResponse(error);
  }
}