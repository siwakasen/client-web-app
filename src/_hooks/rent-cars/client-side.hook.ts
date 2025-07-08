import {
  CarsDetailResponse,
  CarsRequest,
  CarsResponse,
} from "@/_interfaces/rent-car.interface";
import { fetchCars, fetchCarsDetail } from "@/_services/rent-cars";
export async function useSearchCars(
  pagination: CarsRequest,
  token?: string
): Promise<CarsResponse> {
  return await fetchCars(pagination, undefined, token);
}
