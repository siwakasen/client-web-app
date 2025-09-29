import {
  GetRatingsResponse,
  GetRatingsReviewsResponse,
} from '@/interfaces/rating.interface';
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

export const getRatingsByCarId = async (
  carId: number
): Promise<GetRatingsResponse> => {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL);
  const response = await api.get(`/ratings/car/${carId}`);
  return response.data;
};

export const getRatingsByTravelPackageId = async (
  travelPackageId: number
): Promise<GetRatingsResponse> => {
  const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL);
  const response = await api.get(`/ratings/package/${travelPackageId}`);
  return response.data;
};

export const getRatingsReviews =
  async (): Promise<GetRatingsReviewsResponse> => {
    const api = await createApiInstance(
      process.env.NEXT_PUBLIC_BOOKINGS_API_URL
    );
    const response = await api.get(`/ratings/reviews`);
    return response.data;
  };
