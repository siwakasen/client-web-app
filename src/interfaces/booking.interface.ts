export interface BookingWithRegisterRequest {
  package_id?: number;
  car_id?: number;
  with_driver?: boolean;
  number_of_persons?: number;
  start_date: string;
  end_date: string;
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
  success: boolean;
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
