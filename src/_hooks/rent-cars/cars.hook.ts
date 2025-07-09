"use cache";
import {
  CarsDetailResponse,
  CarsRequest,
  CarsResponse,
} from "@/_interfaces/rent-car.interface";
import { fetchCars, fetchCarsDetail } from "@/_services/rent-cars";
export async function useGetCars(
  pagination: CarsRequest,
  headers?: Record<string, string>
): Promise<CarsResponse> {
  return await fetchCars(pagination, headers);
}

export async function useGetCarsDetail(
  id: number,
  headers: Record<string, string>
): Promise<CarsDetailResponse> {
  return await fetchCarsDetail({ id }, headers);
}
