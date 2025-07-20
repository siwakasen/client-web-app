"use server";
import { CarsDetailResponse, CarsResponse, Pagination } from "@/interfaces";
import { fetchCars, fetchCarsDetail } from "@/services/rent-cars";
export async function useGetCars(
  pagination: Pagination
): Promise<CarsResponse> {
  "use cache";
  return await fetchCars(pagination);
}

export async function useGetCarsDetail(
  id: number
): Promise<CarsDetailResponse> {
  "use cache";
  return await fetchCarsDetail({ id });
}
