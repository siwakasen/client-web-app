"use server";

import { createApiInstance } from "../api";

export const capturePaymentPaypal = async (
  orderId: string,
  headers?: Record<string, string>
) => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    headers
  );
  const response = await api.post("/payments/capture-paypal", {
    orderId: orderId,
  });
  return response.data;
};

export const cancelPaymentPaypal = async (
  orderId: string,
  headers?: Record<string, string>
) => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    headers
  );

  const response = await api.patch("/payments/cancel-paypal", {
    orderId: orderId,
  });

  return response.data;
};


export const getPaymentByBookingId = async (bookingId: number, token: string, headers?: Record<string, string>) => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    headers
  );
  const response = await api.get(`/payments/${bookingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};