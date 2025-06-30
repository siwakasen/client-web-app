export interface LoginRequest {
    email: string
    password: string
  }
  
export interface LoginResponse {
    data:{
        message: string
        token: string
    }
  }

export interface RegisterRequest {
    email: string
    password: string
    name: string
    phone_number: string
    country_origin: string
  }
  
  export interface RegisterResponse {
    data:{
        message: string
        token: string
    }
  }

  export interface ForgotPasswordRequest {
    email: string
  }

  export interface ForgotPasswordResponse {
    message: string
  }