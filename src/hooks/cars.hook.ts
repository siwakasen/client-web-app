"use server";
import {
  CarsAvailableRequest,
  CarsDetailResponse,
  CarsResponse,
} from "@/interfaces";
import { availableCars, fetchCarsDetail } from "@/services/rent-cars";
export async function useGetAvailableCars(
  payload: CarsAvailableRequest
): Promise<CarsResponse> {
  "use cache";
  return await availableCars(payload);
}

export async function useGetCarsDetail(
  id: number
): Promise<CarsDetailResponse> {
  "use cache";
  return await fetchCarsDetail({ id });
}
