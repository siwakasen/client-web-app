"use server";
import { createBooking } from "@/services/bookings";
import { getHeaders } from "@/lib";
import { z } from "zod";
import { BookingFormSchema } from "@/lib/validation";
import { getToken } from "@/lib/session";
import { BookingResponse } from "@/interfaces";

export async function useCreateBooking(
  formData: z.infer<typeof BookingFormSchema>
) {
  try {
    const headers = await getHeaders();
    const token = await getToken();
    const response: BookingResponse = await createBooking(
      formData,
      token!,
      headers
    );
    return response;
  } catch (error: any) {
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}
