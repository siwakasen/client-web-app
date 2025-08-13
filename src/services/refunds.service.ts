import { RefundsResponse } from "@/interfaces/refunds.interface";
import { createApiInstance } from "./api";

export const getRefundsById = async (
  headers: Record<string, string>,
  token: string,
  id: string
): Promise<RefundsResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_REFUNDS_API_URL,
    headers,
    token
  );

  const response = await api.get(`/refunds/${id}`);
  return response.data;
};