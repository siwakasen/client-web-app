// utils/apiService.ts
import {
  BookingWithRegisterRequest,
  BookingWithRegisterResponse,
} from "@/_interfaces/booking.interface";
import { createApiInstance } from "../api";

export const createBookingWithRegister = async (
  payload: BookingWithRegisterRequest
): Promise<BookingWithRegisterResponse> => {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL);
  const response: BookingWithRegisterResponse = await api.post(
    "/bookings",
    payload
  );
  return response;
};
