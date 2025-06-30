// utils/apiService.ts
import {
    CarsResponse,
    CarsRequest,
    CarsDetailResponse,
    CarsDetailRequest,
  } from '@/_interfaces/rent-car.interface';
import { createApiInstance } from '../api';
  
  const api = createApiInstance(process.env.NEXT_PUBLIC_CARS_API_URL);

  export const fetchCars = async (
    pagination: CarsRequest
  ): Promise<CarsResponse> => {
    const response = await api.get(
      `/cars?limit=${pagination.limit}&page=${pagination.page}&search=${pagination.search || ''}`
    );
    if(response.status !== 200){
        throw new Error('Failed to fetch cars');
    }
    return response.data;
  };

  export const fetchCarsDetail = async (payload: CarsDetailRequest
    ): Promise<CarsDetailResponse> => {
    const response = await api.get(
        `/cars/${payload.id}`
    );

    if(response.status !== 200){
        throw new Error('Failed to fetch car detail');
    }
    return response.data;

};  