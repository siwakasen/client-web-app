import { z } from "zod";

export const BookingFormSchema = z
  .object({
    package_id: z.number().optional(),
    car_id: z.number().optional(),
    with_driver: z.boolean().optional(),
    number_of_persons: z.number().optional(),
    start_date: z.string().datetime({ message: "Start Date must be provided" }),
    end_date: z.string().datetime().optional(),
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
