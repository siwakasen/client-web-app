"use server";
import { BookingRequest, BookingResponse } from "@/_interfaces";
import { createBooking } from "@/_services/bookings";
import { getHeaders } from "@/lib";

export async function useCreateBooking(
  token: string,
  payload: BookingRequest
): Promise<BookingResponse> {
  const headers = await getHeaders();
  const response = await createBooking(token, payload, headers);
  return response;
}
