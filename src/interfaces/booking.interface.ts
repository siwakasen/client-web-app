import { Meta } from "./common.interface";
import { Payment } from "./payment.interface";

export interface BookingWithRegisterRequest {
  package_id?: number;
  car_id?: number;
  with_driver?: boolean;
  number_of_persons?: number;
  start_date?: string;
  end_date?: string;
  payment_method: string;
  pickup_location: string;
  pickup_time: string;
  additional_notes?: string;
  email: string;
  password: string;
  name: string;
  phone_number?: string;
  country_origin?: string;
}

export interface BookingRequest {
  package_id?: number;
  car_id?: number;
  with_driver?: boolean;
  number_of_persons?: number;
  start_date?: string;
  end_date?: string;
  payment_method: string;
  pickup_location: string;
  pickup_time: string;
  additional_notes?: string;
}
export interface BookingWithRegisterResponse {
  data: DataWithRegister;
}

export interface DataWithRegister {
  message: string;
  redirect_url: string;
  token: string;
}

export interface DataWithoutRegister {
  message: string;
  redirect_url: string;
}

export interface BookingResponse {
  data: DataWithoutRegister;
}

export interface BookingResponseById {
  data: Booking;
  message: string;
}

export interface Booking {
  id: number
  package_id: number
  car_id: number
  customer_id: number
  employee_id: number
  with_driver: boolean
  number_of_persons: number
  start_date: string
  end_date: string
  total_price: number
  status: string
  pickup_location: string
  pickup_time: string
  additional_notes: string
  created_at: string
  updated_at: string
  payments: Payment[]
}
export interface BookingHistoryResponse {
  data: Booking[]
  meta: Meta
}
