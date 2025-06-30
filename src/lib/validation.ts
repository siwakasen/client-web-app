import { z } from "zod"

export const RegisterFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }).trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .trim(),
  phone_number: z.string().optional(),
  country_origin: z.string().optional(),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        phone_number?: string[]
        country_origin?: string[]
      }
      message?: string
    }
  | undefined

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
})

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
})

export type ForgotPasswordFormState =
  | {
      errors?: {
        email?: string[]
      }
      message?: string
    }
  | undefined
