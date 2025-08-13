import { getHeaders } from "@/lib/users-provider";
import { getRefundsById } from "@/services/refunds.service";
import { getToken } from "@/lib/users-provider/cookies";
import { RefundsResponse } from "@/interfaces/refunds.interface";

export async function useGetRefundsById(id: string) : Promise<RefundsResponse | {
  status: number;
  errors: any;
}> {
  const headers = await getHeaders();
  const token = await getToken();
  try {
    const response = await getRefundsById(headers, token!, id);
    return response;
  } catch (error: any) {
    console.error(error);
    return {
      status: error.response.status,
      errors: error.response.data,
    };
  }
}