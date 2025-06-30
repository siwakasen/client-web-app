// utils/apiService.ts
import {
    TravelPackagesResponse,
    TravelPackagesRequest   ,
    TravelPackagesDetailRequest,
    TravelPackagesDetailResponse,
  } from '@/_interfaces/travel-packages.interface';
import { createApiInstance } from '../api';
import { AxiosResponse } from 'axios';

const api = createApiInstance(process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API);

export const fetchTravelPackages = async (
    pagination: TravelPackagesRequest
    ): Promise<TravelPackagesResponse> => {
    const response = await api.get(
        `/travel-packages?limit=${pagination.limit}&page=${pagination.page}&search=${pagination.search || ''}`
    );
    if(response.status !== 200){
        throw new Error('Failed to fetch travel packages');
    }
    return response.data;
};

export const fetchTravelPackagesDetail = async (payload: TravelPackagesDetailRequest
    ): Promise<TravelPackagesDetailResponse> => {
    const response : AxiosResponse = await api.get(
        `/travel-packages/${payload.id}`
    );
    if(response.status !== 200){
        throw new Error('Failed to fetch travel packages detail');
    }
    return response.data;
};
