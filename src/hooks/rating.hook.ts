'use server';
import { getHeaders, getToken } from '@/lib/users-provider';
import {
  createRating,
  getRatingsByCarId,
  getRatingsByTravelPackageId,
  getRatingsReviews,
} from '@/services/rating.service';
import { ErrorResponse } from './common.hook';
import {
  GetRatingsResponse,
  GetRatingsReviewsResponse,
} from '@/interfaces/rating.interface';

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

export async function useGetRatingsByCarId(carId: number): Promise<
  | GetRatingsResponse
  | {
      status: number;
      errors?: any;
    }
> {
  try {
    ('use cache');
    const response = await getRatingsByCarId(carId);
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}

export async function useGetRatingsByTravelPackageId(
  travelPackageId: number
): Promise<
  | GetRatingsResponse
  | {
      status: number;
      errors?: any;
    }
> {
  try {
    ('use cache');
    const response = await getRatingsByTravelPackageId(travelPackageId);
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}

export async function useGetRatingsReviews(): Promise<
  | GetRatingsReviewsResponse
  | {
      status: number;
      errors?: any;
    }
> {
  'use cache';
  try {
    const response = await getRatingsReviews();
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}
