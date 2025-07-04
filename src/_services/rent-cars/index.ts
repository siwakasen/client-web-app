// utils/apiService.ts
import {
    CarsResponse,
    CarsRequest,
    CarsDetailResponse,
    CarsDetailRequest,
  } from '@/_interfaces/rent-car.interface';
import { createApiInstance } from '../api';
import { AxiosResponse } from 'axios';
  
  const api = createApiInstance(process.env.NEXT_PUBLIC_CARS_API_URL);

  export async function fetchCars (
    pagination: CarsRequest
  ): Promise<CarsResponse> {
    try {
        const response : AxiosResponse = await api.get(
            `/cars?limit=${pagination.limit}&page=${pagination.page}&search=${pagination.search || ''}`
        );
        if(response.status !== 200){
            throw new Error('Failed to fetch cars');
        }
        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
    }
    
  };

  export async function fetchCarsDetail (payload: CarsDetailRequest
    ): Promise<CarsDetailResponse> {
      try {
        
        const response = await api.get(
            `/cars/${payload.id}`
        );
        if(response.status !== 200){
            throw new Error('Failed to fetch car detail');
        }
        return response.data;
    } catch (error) {
        throw error instanceof Error ? error : new Error(String(error));
    }

};  