"use server";
import {
  Car,
  CarsAvailableRequest,
  CarsDetailResponse,
  CarsResponse,
  Pagination,
} from "@/interfaces";
import { availableCars, fetchCars, fetchCarsDetail, fetchCarsDetailHistory } from "@/services";
import { ErrorResponse } from "./common.hook";

export async function useGetCars(
  payload: Pagination
): Promise<CarsResponse> {
  try {
  return await fetchCars(payload);
} catch (error: any) {
  return ErrorResponse(error,{
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
export async function useGetAvailableCars(
  payload: CarsAvailableRequest
): Promise<CarsResponse > {
  try {
    return await availableCars(payload);
  } catch (error: any) {
    return ErrorResponse(error,{
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

export async function useGetCarsDetail(
  id: number
): Promise<CarsDetailResponse> {
  try {
    return await fetchCarsDetail({ id });
  } catch (error: any) {
    return ErrorResponse(error, {
      data: {} as Car,
      message: 'Error fetching car detail',
    });
  }
}
export async function useGetCarsDetailHistory(
  id: number,
): Promise<CarsDetailResponse> {
  try {
    return await fetchCarsDetailHistory({ id });
  } catch (error: any) {
    return ErrorResponse(error, {
      data: {} as Car,
      message: 'Error fetching car detail history',
    });
  }
}