"use server";
import {
  CarsAvailableRequest,
  CarsDetailResponse,
  CarsResponse,
  Pagination,
} from "@/interfaces";
import { availableCars, fetchCars, fetchCarsDetail, fetchCarsDetailHistory } from "@/services";

export async function useGetCars(
  payload: Pagination
): Promise<CarsResponse> {
  "use cache";
  return await fetchCars(payload);
}
export async function useGetAvailableCars(
  payload: CarsAvailableRequest
): Promise<CarsResponse> {
  return await availableCars(payload);
}

export async function useGetCarsDetail(
  id: number
): Promise<CarsDetailResponse> {
  return await fetchCarsDetail({ id });
}
export async function useGetCarsDetailHistory(
  id: number,
): Promise<CarsDetailResponse> {
  return await fetchCarsDetailHistory({ id });
}