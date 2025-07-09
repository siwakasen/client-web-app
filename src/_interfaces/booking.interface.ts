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
  start_date?: Date;
  end_date?: Date;
  payment_method: string;
  pickup_location: string;
  pickup_time: string;
}
export interface BookingWithRegisterResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  message: string;
  redirect_url: string;
  token: string;
}
