import { z } from "zod";

export const BookingFormSchema = z
  .object({
    package_id: z.number().optional(),
    car_id: z.number().optional(),
    with_driver: z.boolean().optional(),
    number_of_persons: z.number().optional(),
    start_date: z.string().min(1, { message: "Start Date must be provided" }),
    end_date: z.string().min(1, { message: "End Date must be provided" }),
    payment_method: z.enum(["MIDTRANS", "PAYPAL"]),
    pickup_location: z
      .string()
      .min(1, { message: "Pickup location must be provided" })
      .trim(),
    pickup_time: z
      .string()
      .min(1, { message: "Pickup time must be provided" })
      .trim(),
    additional_notes: z.string().optional(),
    identity_file: z.array(z.instanceof(File)).optional(),
  })
  .refine(
    (data) => {
      if (data.car_id !== undefined) {
        return data.end_date !== undefined && data.with_driver !== undefined;
      }
      return true;
    },
    {
      message: "end_date and with_driver are required when booking a car",
      path: ["end_date", "with_driver"],
    }
  )
  .refine(
    (data) => {
      if (data.package_id !== undefined) {
        return data.number_of_persons !== undefined;
      }
      return true;
    },
    {
      message: "number_of_persons is required when booking a package",
      path: ["number_of_persons"],
    }
  );

export const BookingRegisterFormSchema = z
  .object({
    package_id: z.number().optional(),
    car_id: z.number().optional(),
    with_driver: z.boolean().optional(),
    number_of_persons: z.number().optional(),
    start_date: z.string().min(1, { message: "Start Date must be provided" }),
    end_date: z.string(),
    payment_method: z.enum(["MIDTRANS", "PAYPAL"]),
    pickup_location: z
      .string()
      .min(1, { message: "Pickup location must be provided" })
      .trim(),
    pickup_time: z
      .string()
      .min(1, { message: "Pickup time must be provided" })
      .trim(),
    additional_notes: z.string().optional(),
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
    identity_file: z.array(z.instanceof(File)).optional(),
  })
  .refine(
    (data) => {
      if (data.car_id !== undefined) {
        return data.end_date !== undefined && data.with_driver !== undefined;
      }
      return true;
    },
    {
      message: "end_date and with_driver are required when booking a car",
      path: ["end_date", "with_driver"],
    }
  )
  .refine(
    (data) => {
      if (data.package_id !== undefined) {
        return data.number_of_persons !== undefined;
      }
      return true;
    },
    {
      message: "number_of_persons is required when booking a package",
      path: ["number_of_persons"],
    }
  )
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must be match",
    path: ["confirm_password"],
  })
  .refine(
    (data) => {
      if (data.car_id !== undefined) {
        return data.identity_file && data.identity_file.length === 2;
      }
      return true;
    },
    {
      message: "Please upload identity and driver license files",
      path: ["identity_file"],
    }
  );
