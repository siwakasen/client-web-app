// utils/apiService.ts
import {
  BookingWithRegisterRequest,
  BookingWithRegisterResponse,
  BookingRequest,
  BookingResponse,
} from "@/interfaces";
import { createApiInstance } from "../api";

export const createBookingWithRegister = async (
  payload: BookingWithRegisterRequest
): Promise<BookingWithRegisterResponse> => {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL);
  const response: BookingWithRegisterResponse = await api.post(
    "/bookings/and-register",
    payload
  );
  return response;
};

export const createBooking = async (
  payload: BookingRequest,
  token: string,
  headers: Record<string, string>
): Promise<BookingResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    headers,
    token
  );

  const response = await api.post("/bookings", payload);
  return response.data;
};
