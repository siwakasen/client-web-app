"use server";
import {
  changePassword,
  forgotPassword,
  getCustomer,
  register,
} from "@/services/customers";
import {
  RegisterFormSchema,
  ForgotPasswordFormSchema,
  LoginFormSchema,
} from "@/lib/validation";
import { ChangePasswordRequest } from "@/interfaces";
import { login } from "@/services/customers";
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
    if (
      message.includes("Invalid token") ||
      error.code == "ECONNREFUSED" ||
      error.code == "ERR_NETWORK"
    ) {
      redirect("/redirect/reset-cookie", RedirectType.replace);
    }
    return { isAuthenticated: false, customer: undefined };
  }
}
