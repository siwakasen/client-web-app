"use server";

import { cancelPaymentPaypal, capturePaymentPaypal } from "@/services/payment";

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
