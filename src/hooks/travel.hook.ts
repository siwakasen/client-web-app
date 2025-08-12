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
  fetchTravelPackagesDetailHistory,
} from "@/services";

export async function useGetTravelPackages(
  pagination: Pagination
): Promise<TravelPackagesResponse> {
  "use cache";
  return await fetchTravelPackages(pagination);
}

export async function useGetTravelPackagesDetail(
  pagination: TravelPackagesDetailRequest
): Promise<TravelPackagesDetailResponse> {
  "use cache";
  return await fetchTravelPackagesDetail(pagination);
}

export async function useGetTravelPackagesDetailHistory(
  id: number
): Promise<TravelPackagesDetailResponse> {  
  return await fetchTravelPackagesDetailHistory(id);
}