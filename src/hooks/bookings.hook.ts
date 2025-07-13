"use server";
import { BookingRequest, BookingResponse } from "@/interfaces";
import { createBooking } from "@/services/bookings";
import { getHeaders } from "@/lib";

export async function useCreateBooking(
  token: string,
  payload: BookingRequest
): Promise<BookingResponse> {
  const headers = await getHeaders();
  const response = await createBooking(token, payload, headers);
  return response;
}
