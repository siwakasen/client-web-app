"use server";
import { CarsDetailResponse, CarsResponse, Pagination } from "@/interfaces";
import { fetchCars, fetchCarsDetail } from "@/services/rent-cars";
export async function useGetCars(
  pagination: Pagination,
  headers?: Record<string, string>
): Promise<CarsResponse> {
  "use cache";
  return await fetchCars(pagination, headers);
}

export async function useGetCarsDetail(
  id: number,
  headers: Record<string, string>
): Promise<CarsDetailResponse> {
  "use cache";
  return await fetchCarsDetail({ id }, headers);
}
