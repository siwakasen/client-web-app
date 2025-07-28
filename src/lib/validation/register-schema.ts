import { z } from "zod";
export const RegisterFormSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long." })
      .trim(),
    email: z
      .string()
      .min(1, { message: "Email must be provided" })
      .email({ message: "Please enter a valid email." })
      .trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character.",
      })
      .trim(),
    confirm_password: z.string().trim(),
    phone_number: z.string().optional(),
    country_origin: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must be match",
    path: ["confirm_password"], // This will attach the error to the confirm_password field
  });
