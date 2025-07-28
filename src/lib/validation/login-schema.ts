import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email must be provided" })
    .email({ message: "Please enter a valid email." })
    .trim(),
  password: z.string().min(1, { message: "Password must be provided" }).trim(),
});
