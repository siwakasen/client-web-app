"use server";
import {
  CustomerResponse,
  RegisterRequest,
} from "@/_interfaces/customer.interface";
import { forgotPassword, getCustomer, register } from "@/_services/customers";
import { RegisterFormSchema, type FormState } from "@/lib/validation";
import { LoginFormSchema, type LoginFormState } from "@/lib/validation";
import { login } from "@/_services/customers";
import {
  ForgotPasswordFormSchema,
  type ForgotPasswordFormState,
} from "@/lib/validation";
import { createSession, deleteSession } from "@/lib/session";
import { getHeaders } from "@/lib";

export async function useRegisterUser(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone_number: formData.get("phone_number"),
    country_origin: formData.get("country_origin"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const headers = await getHeaders();
  const response = await register(
    validatedFields.data as RegisterRequest,
    headers
  );
  // Store token in localStorage if running on client and token exists

  return {
    message: response.data.message || "Registration successful!",
  };
}

export async function useLoginUser(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const headers = await getHeaders();
    const { data } = await login(validatedFields.data, headers);
    await createSession(data.token);
    return {
      message: data.message || "Login successful!",
      token: data.token,
    };
  } catch (error: any) {
    return {
      errors: { email: ["Invalid email or password."] },
    };
  }
}

export async function useForgotPasswordUser(
  state: ForgotPasswordFormState,
  formData: FormData
): Promise<ForgotPasswordFormState> {
  const validatedFields = ForgotPasswordFormSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const headers = await getHeaders();
  const { message } = await forgotPassword(validatedFields.data, headers);
  return {
    message: message || "Forgot password successful!",
  };
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
  return await getCustomer(token, headers);
}
