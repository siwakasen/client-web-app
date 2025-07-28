"use server";
import { createBooking, createBookingWithRegister } from "@/services/bookings";
import { getHeaders } from "@/lib/users-provider";
import { z } from "zod";
import { BookingFormSchema, BookingRegisterFormSchema } from "@/lib/validation";
import { createSession, getToken } from "@/lib/users-provider/cookies";
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

export async function useCreateBookingWithRegister(
  formData: z.infer<typeof BookingRegisterFormSchema>
) {
  try {
    const response = await createBookingWithRegister(formData);
    await createSession(response.data.token);
    return response;
  } catch (error: any) {
    console.warn("booking error:", error.response);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}
