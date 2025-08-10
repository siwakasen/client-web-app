"use server";

import { getHeaders, getToken } from "@/lib/users-provider";
import { cancelPaymentPaypal, capturePaymentPaypal, getPaymentByBookingId } from "@/services/payment";
import { PaymentResponse } from "@/interfaces";

export async function useCapturePaymentPaypal(orderId: string): Promise<{
  statusCode: number;
  message: string;
}> {
  try {
    const response = await capturePaymentPaypal(orderId);
    return {
      statusCode: 200,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      statusCode: error.response.status,
      message: error.response.data.message,
    };
  }
}

export async function useCancelPaymentPaypal(orderId: string): Promise<{
  statusCode: number;
  message: string;
}> {
  try {
    const response = await cancelPaymentPaypal(orderId);
    console.log(response);
    return {
      statusCode: 200,
      message: response.data.message,
    };
  } catch (error: any) {
    console.log(error);
    return {
      statusCode: error.response.status,
      message: error.response.data.message,
    };
  }
}

export async function   useGetPaymentByBookingId(bookingId: number) : Promise<PaymentResponse | {
  status: number;
  errors: any;
}> {
  try {
    const headers = await getHeaders();
    const token = await getToken();
    const response = await getPaymentByBookingId(bookingId, token!, headers);
    return response;
  } catch (error: any) {
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}