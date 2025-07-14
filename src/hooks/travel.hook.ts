"use server";
import {
  Pagination,
  TravelPackagesDetailRequest,
  TravelPackagesDetailResponse,
  TravelPackagesResponse,
} from "@/interfaces";
import {
  fetchTravelPackages,
  fetchTravelPackagesDetail,
} from "@/services/travel-packages";
export async function useGetTravelPackages(
  pagination: Pagination,
  headers?: Record<string, string>
): Promise<TravelPackagesResponse> {
  "use cache";
  return await fetchTravelPackages(pagination, headers);
}

export async function useGetTravelPackagesDetail(
  pagination: TravelPackagesDetailRequest,
  headers?: Record<string, string>
): Promise<TravelPackagesDetailResponse> {
  "use cache";
  return await fetchTravelPackagesDetail(pagination, headers);
}
