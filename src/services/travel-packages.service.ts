import {
  TravelPackagesResponse,
  Pagination,
  TravelPackagesDetailRequest,
  TravelPackagesDetailResponse,
} from "@/interfaces";
import { createApiInstance } from "./api";
import { AxiosResponse } from "axios";

export async function fetchTravelPackages(
  pagination: Pagination
): Promise<TravelPackagesResponse> {
  try {
    const api = await createApiInstance(
      process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL
    );
    const response = await api.get(
      `/travel-packages?limit=${pagination.limit}&page=${
        pagination.page
      }&search=${pagination.search || ""}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to  fetch travel packages");
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function fetchTravelPackagesDetail(
  payload: TravelPackagesDetailRequest
): Promise<TravelPackagesDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL
  );
  const response: AxiosResponse = await api.get(
    `/travel-packages/${payload.id}`
  );
  if (response.status !== 200) {
    throw new Error("Failed to fetch travel packages detail");
  }
  return response.data;
}
export async function fetchTravelPackagesDetailHistory(
  id: number,
): Promise<TravelPackagesDetailResponse> {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL
  );
  const response: AxiosResponse = await api.get(`/travel-packages/${id}/history`);
  return response.data;
}