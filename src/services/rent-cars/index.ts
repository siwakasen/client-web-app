import {
  CarsResponse,
  Pagination,
  CarsDetailResponse,
  CarsDetailRequest,
} from "@/interfaces";
import { createApiInstance } from "../api";
import { AxiosResponse } from "axios";

export async function fetchCars(pagination: Pagination): Promise<CarsResponse> {
  try {
    const api = await createApiInstance(process.env.NEXT_PUBLIC_CARS_API_URL);
    const response: AxiosResponse = await api.get(
      `/cars?limit=${pagination.limit}&page=${pagination.page}&search=${
        pagination.search || ""
      }`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch cars");
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function fetchCarsDetail(
  payload: CarsDetailRequest
): Promise<CarsDetailResponse> {
  try {
    const api = await createApiInstance(process.env.NEXT_PUBLIC_CARS_API_URL);
    const response = await api.get(`/cars/${payload.id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch car detail");
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
