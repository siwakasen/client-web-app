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
  token?: string
): Promise<TravelPackagesResponse> {
  return await fetchTravelPackages(pagination, undefined, token);
}

export async function useGetTravelPackagesDetail(
  pagination: TravelPackagesDetailRequest,
  token?: string
): Promise<TravelPackagesDetailResponse> {
  return await fetchTravelPackagesDetail(pagination, undefined, token);
}
