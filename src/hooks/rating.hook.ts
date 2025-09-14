'use server';
import { getHeaders, getToken } from '@/lib/users-provider';
import { createRating } from '@/services/rating.service';
import { ErrorResponse } from './common.hook';

export async function useCreateRating(data: {
  booking_id: number;
  service_rate: number;
  description?: string;
}): Promise<{
  status: number;
  errors?: any;
}> {
  const headers = await getHeaders();
  const token = await getToken();
  try {
    const response = await createRating(headers, token!, data);
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}
