"use server"

import { RegisterRequest } from "@/_interfaces/customer.interface"
import { forgotPassword, register } from "@/_services/customers"
import { RegisterFormSchema, type FormState } from "@/lib/validation"
import { LoginFormSchema, type LoginFormState } from "@/lib/validation"
import { login } from "@/_services/customers"
import { ForgotPasswordFormSchema, type ForgotPasswordFormState } from "@/lib/validation"

export async function useRegisterUser(state: FormState, formData: FormData): Promise<FormState> {
  // Validate form fields
  const validatedFields = RegisterFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone_number: formData.get("phone_number"),
    country_origin: formData.get("country_origin"),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const response = await register(validatedFields.data as RegisterRequest)
  
  
}

export async function useLoginUser(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const { data } = await login(validatedFields.data)
    return {
      message: data.message || "Login successful!",
    }
  } catch (error: any) {
    return {
      errors: { email: ["Invalid email or password."] },
    }
  }
}

export async function useForgotPasswordUser(state: ForgotPasswordFormState, formData: FormData): Promise<ForgotPasswordFormState> {
  const validatedFields = ForgotPasswordFormSchema.safeParse({
    email: formData.get("email"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { message } = await forgotPassword(validatedFields.data)
  return {
    message: message || "Forgot password successful!",
  }
}
