"use server";

import { createApiInstance } from "../api";

export async function capturePaymentPaypal(
  orderId: string,
  headers?: Record<string, string>
) {
  try {
    const api = await createApiInstance(
      headers!,
      process.env.NEXT_PUBLIC_BOOKINGS_API_URL
    );

    const response = await api.post("/payments/capture-paypal", {
      orderId: orderId,
    });

    if (response.status !== 201) {
      throw new Error("Failed to process payment with backend");
    }

    return {
      statusCode: response.status,
      message: "Payment processed successfully",
      orderId: orderId,
    };
  } catch (error: any) {
    return {
      statusCode: error.status,
      message: error.message,
      orderId: orderId,
    };
  }
}
export async function cancelPaymentPaypal(
  orderId: string,
  headers?: Record<string, string>
) {
  try {
    const api = await createApiInstance(
      headers!,
      process.env.NEXT_PUBLIC_BOOKINGS_API_URL
    );

    const response = await api.patch("/payments/cancel-paypal", {
      orderId: orderId,
    });

    console.log(response.data);

    if (response.status !== 200) {
      throw new Error("Failed to process payment with backend");
    }

    return {
      statusCode: response.status,
      message: response.data.message,
      orderId: orderId,
    };
  } catch (error: any) {
    console.log(error);
    return {
      statusCode: error.status,
      message: error.message,
      orderId: orderId,
    };
  }
}
