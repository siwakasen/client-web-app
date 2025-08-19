import { z } from "zod";

export const ForgetPasswordFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
});
export const ChangePasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[!@#$%^&*-+_=?.,]/, {
        message: "Password must contain at least one special character.",
      })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password must be provided" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must be match",
    path: ["confirmPassword"],
  });
