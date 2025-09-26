'use server';
import {
  Pagination,
  TravelPackages,
  TravelPackagesDetailRequest,
  TravelPackagesDetailResponse,
  TravelPackagesResponse,
} from '@/interfaces';
import {
  fetchTravelPackages,
  fetchTravelPackagesDetail,
  fetchTravelPackagesDetailHistory,
} from '@/services';
import { toast } from 'sonner';
import { ErrorResponse } from './common.hook';

export async function useGetTravelPackages(
  pagination: Pagination
): Promise<TravelPackagesResponse> {
  try {
    return await fetchTravelPackages(pagination);
  } catch (error: any) {
    toast.error('Error fetching travel packages');
    return ErrorResponse(error, {
      data: [],
      meta: {
        totalItems: 0,
        currentPage: 1,
        totalPages: 0,
        limit: 10,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  }
}

export async function useGetTravelPackagesDetail(
  pagination: TravelPackagesDetailRequest
): Promise<TravelPackagesDetailResponse> {
  try {
    return await fetchTravelPackagesDetail(pagination);
  } catch (error: any) {
    toast.error('Error fetching travel package detail');
    return ErrorResponse(error, {
      data: {} as TravelPackages,
      message: 'Error fetching travel package detail',
    });
  }
}

export async function useGetTravelPackagesDetailHistory(
  id: number
): Promise<TravelPackagesDetailResponse> {
  'use cache';
  try {
    return await fetchTravelPackagesDetailHistory(id);
  } catch (error: any) {
    toast.error('Error fetching travel package detail history');
    return ErrorResponse(error, {
      data: {} as TravelPackages,
      message: 'Error fetching travel package detail history',
    });
  }
}
