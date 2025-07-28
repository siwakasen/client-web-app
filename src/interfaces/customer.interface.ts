export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    message: string;
    token: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone_number?: string;
  country_origin?: string;
}

export interface RegisterResponse {
  data: {
    message: string;
    token: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordResponse {
  message: string;
}
export interface CustomerResponse {
  data: Customer;
}

export interface Customer {
  id: number;
  name: string;
  phone_number: any;
  country_origin: any;
  email: string;
  identity_file: any;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
