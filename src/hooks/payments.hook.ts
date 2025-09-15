'use server';

import { getHeaders, getToken } from '@/lib/users-provider';
import {
  cancelPaymentPaypal,
  capturePaymentPaypal,
  getPaymentByBookingId,
} from '@/services';
import { PaymentResponse } from '@/interfaces';
import { ErrorResponse } from './common.hook';

export async function useCapturePaymentPaypal(orderId: string): Promise<{
  status: number;
  message?: string;
  errors?: any;
}> {
  try {
    const response = await capturePaymentPaypal(orderId);
    return {
      status: 200,
      message: response.data.message,
    };
  } catch (error: any) {
    return ErrorResponse(error);
  }
}

export async function useCancelPaymentPaypal(orderId: string): Promise<{
  status: number;
  message?: string;
  errors?: any;
}> {
  try {
    const response = await cancelPaymentPaypal(orderId);
    return {
      status: 200,
      message: response.data.message,
    };
  } catch (error: any) {
    return ErrorResponse(error);
  }
}

export async function useGetPaymentByBookingId(bookingId: number): Promise<
  | PaymentResponse
  | {
      status: number;
      errors?: any;
    }
> {
  try {
    const headers = await getHeaders();
    const token = await getToken();
    const response = await getPaymentByBookingId(bookingId, token!, headers);
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}
