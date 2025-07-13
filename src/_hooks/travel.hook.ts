"use server";
import {
  Pagination,
  TravelPackagesDetailRequest,
  TravelPackagesDetailResponse,
  TravelPackagesResponse,
} from "@/_interfaces";
import {
  fetchTravelPackages,
  fetchTravelPackagesDetail,
} from "@/_services/travel-packages";
import { unstable_cacheLife as cacheLife } from "next/cache";
export async function useGetTravelPackages(
  pagination: Pagination,
  headers?: Record<string, string>
): Promise<TravelPackagesResponse> {
  "use cache";
  cacheLife("hours");
  return await fetchTravelPackages(pagination, headers);
}

export async function useGetTravelPackagesDetail(
  pagination: TravelPackagesDetailRequest,
  headers?: Record<string, string>
): Promise<TravelPackagesDetailResponse> {
  "use cache";
  cacheLife("hours");
  return await fetchTravelPackagesDetail(pagination, headers);
}
