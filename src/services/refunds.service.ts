import { RefundsResponse } from "@/interfaces/refunds.interface";
import { createApiInstance } from "./api";
import { RefundFormSchema } from "@/lib/validation";

export const getRefundsByIdBooking = async (
  headers: Record<string, string>,
  token: string,
  id: number
): Promise<RefundsResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    headers,
    token
  );

  const response = await api.get(`/refunds/${id}`);
  return response.data;
};

export const addRefundForm = async (
  headers: Record<string, string>,
  token: string,
  id: number,
  data: {
    bank_name?: string;
    account_number?: string;
    account_name: string;
  }
) => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    headers,
    token
  );

  const response = await api.patch(`/refunds/save-form/${id}`, data);
  return response.data;
};