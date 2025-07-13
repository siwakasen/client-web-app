"use server";
import { unstable_cacheLife as cacheLife } from "next/cache";
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
  "use cache";
  cacheLife("hours");
  return await fetchCars(pagination, headers);
}

export async function useGetCarsDetail(
  id: number,
  headers: Record<string, string>
): Promise<CarsDetailResponse> {
  "use cache";
  cacheLife("hours");
  return await fetchCarsDetail({ id }, headers);
}
