import {
  CarsResponse,
  Pagination,
  CarsDetailResponse,
  CarsDetailRequest,
  CarsAvailableRequest,
} from "@/interfaces";
import { createApiInstance } from "../api";
import { AxiosResponse } from "axios";


export async function availableCars(
  payload: CarsAvailableRequest
): Promise<CarsResponse> {
  try {
    const api = await createApiInstance(process.env.NEXT_PUBLIC_CARS_API_URL);
    const response: AxiosResponse = await api.get(
      `/cars/available?limit=${payload.limit}&page=${payload.page}&search=${
        payload.search || ""
      }&start_date=${payload.start_date}&end_date=${payload.end_date}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to fetch available cars");
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
