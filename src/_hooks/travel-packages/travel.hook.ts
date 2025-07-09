"use cache";
import {
  TravelPackagesRequest,
  TravelPackagesDetailRequest,
  TravelPackagesDetailResponse,
  TravelPackagesResponse,
} from "@/_interfaces/travel-packages.interface";
import {
  fetchTravelPackages,
  fetchTravelPackagesDetail,
} from "@/_services/travel-packages";
export async function useGetTravelPackages(
  pagination: TravelPackagesRequest,
  headers?: Record<string, string>
): Promise<TravelPackagesResponse> {
  return await fetchTravelPackages(pagination, headers);
}

export async function useGetTravelPackagesDetail(
  pagination: TravelPackagesDetailRequest,
  headers?: Record<string, string>
): Promise<TravelPackagesDetailResponse> {
  return await fetchTravelPackagesDetail(pagination, headers);
}
