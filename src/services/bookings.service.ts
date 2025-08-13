import {
  BookingWithRegisterRequest,
  BookingWithRegisterResponse,
  BookingRequest,
  BookingResponse,
  BookingHistoryResponse,
} from "@/interfaces";
import { createApiInstance } from "./api";

export const createBookingWithRegister = async (
  payload: BookingWithRegisterRequest
): Promise<BookingWithRegisterResponse> => {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL);
  const response = await api.post("/bookings/and-register", payload);
  return response.data;
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

export const getBookingById = async (order_id: string, headers: Record<string, string>, token: string) => {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL, headers, token);
  const response = await api.get(`/bookings/${order_id}`);
  return response.data;
}

export const getBookingHistory = async (headers: Record<string, string>, token: string, page: number, limit: number, status?: string) : Promise<BookingHistoryResponse> => {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL, headers, token);
  const response = await api.get("/bookings", {
    params: {
      page,
      limit,
      search:status
    },
  });
  return response.data;
}

