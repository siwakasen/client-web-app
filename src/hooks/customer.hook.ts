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
    console.log(error.response.data);

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
    if (error.code == "ECONNREFUSED") {
      return {
        status: 500,
        errors: {
          message: "Server are not available",
        },
      };
    }
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useForgetPasswordUser(
  formData: z.infer<typeof ForgetPasswordFormSchema>
) {
  try {
    const headers = await getHeaders();
    const { message } = await forgetPassword(formData, headers);

    return {
      message: message || "Email to reset password sent!",
    };
  } catch (error: any) {
    console.log(error.response);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useChangePasswordUser(
  formData: ChangePasswordRequest
): Promise<{ message?: string; status?: number; errors?: any }> {
  try {
    const { message } = await changePassword(formData);
    return { message };
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
    if (!token) {
      return { isAuthenticated: false, customer: undefined };
    }
    const { data } = await getCustomer(token, headers);
    return { isAuthenticated: true, customer: data };
  } catch (error: any) {
    console.warn(error);
    const message: string = error.message;
    console.info(error.code);
    console.log(error.response?.data);
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
}

export async function useUploadIdentityFile(identityFile: File[]) {
  try {
    const token = (await getToken()) || "";
    const response = await uploadIdentityFile(identityFile, token);
    return { message: response };
  } catch (error: any) {
    return { status: error.response.status, errors: error.response.data };
  }
}