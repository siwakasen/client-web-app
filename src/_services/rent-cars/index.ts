import {
  CarsResponse,
  CarsRequest,
  CarsDetailResponse,
  CarsDetailRequest,
} from "@/_interfaces/rent-car.interface";
import { createApiInstance } from "../api";
import { AxiosResponse } from "axios";

export async function fetchCars(
  pagination: CarsRequest,
  headers?: Record<string, string>,
  token?: string
): Promise<CarsResponse> {
  try {
    const api = await createApiInstance(
      headers!,
      process.env.NEXT_PUBLIC_CARS_API_URL,
      token
    );
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
  payload: CarsDetailRequest,
  headers?: Record<string, string>,
  token?: string
): Promise<CarsDetailResponse> {
  try {
    const api = await createApiInstance(
      headers!,
      process.env.NEXT_PUBLIC_CARS_API_URL,
      token
    );
    const response = await api.get(`/cars/${payload.id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch car detail");
    }
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
