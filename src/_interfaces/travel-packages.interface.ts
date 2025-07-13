import { Meta } from "./common.interface";

export interface TravelPackagesResponse {
  data: TravelPackages[];
  meta: Meta;
}

export interface TravelPackages {
  id: number;
  package_name: string;
  description: string;
  images?: string[];
  package_price: number;
  duration: number;
  max_persons: number;
  itineraries: string[];
  includes: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface TravelPackagesDetailResponse {
  data: TravelPackages;
  message: string;
}

export interface TravelPackagesDetailRequest {
  id: number;
}
