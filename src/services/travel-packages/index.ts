import {
  TravelPackagesResponse,
  Pagination,
  TravelPackagesDetailRequest,
  TravelPackagesDetailResponse,
} from "@/interfaces";
import { createApiInstance } from "../api";
import { AxiosResponse } from "axios";

export async function fetchTravelPackages(
  pagination: Pagination,
  headers?: Record<string, string>,
  token?: string
): Promise<TravelPackagesResponse> {
  try {
    const api = await createApiInstance(
      headers || {},
      process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API,
      token
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
  payload: TravelPackagesDetailRequest,
  headers?: Record<string, string>,
  token?: string
): Promise<TravelPackagesDetailResponse> {
  const api = await createApiInstance(
    headers || {},
    process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API,
    token
  );
  const response: AxiosResponse = await api.get(
    `/travel-packages/${payload.id}`
  );
  if (response.status !== 200) {
    throw new Error("Failed to fetch travel packages detail");
  }
  return response.data;
}
