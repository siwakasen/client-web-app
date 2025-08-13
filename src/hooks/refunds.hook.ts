'use server';

import { getHeaders } from "@/lib/users-provider";
import { addRefundForm, getRefundsByIdBooking } from "@/services/refunds.service";
import { getToken } from "@/lib/users-provider/cookies";
import { RefundsResponse } from "@/interfaces/refunds.interface";

export async function useGetRefundsByIdBooking(id: number) : Promise<RefundsResponse | {
  status: number;
  errors: any;
}> {
  const headers = await getHeaders();
  const token = await getToken();
  try {
    const response = await getRefundsByIdBooking(headers, token!, id);
    return response;
  } catch (error: any) {
    console.error(error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}

export async function useAddRefundForm(id: number, data: {
  bank_name?: string;
  account_number?: string;
  account_name: string;
}) : Promise<{message: string} | {
  status: number;
  errors: any;
}> {
  const headers = await getHeaders();
  const token = await getToken();
  try {
    const response = await addRefundForm(headers, token!, id, data);
    return response;
  } catch (error: any) {
    console.error(error.response.data);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}