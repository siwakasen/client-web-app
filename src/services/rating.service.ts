import { createApiInstance } from './api';

export const createRating = async (
  headers: Record<string, string>,
  token: string,
  data: {
    booking_id: number;
    service_rate: number;
    description?: string;
  }
) => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_BOOKINGS_API_URL,
    headers,
    token
  );
  const response = await api.post('/ratings', data);
  return response.data;
};
