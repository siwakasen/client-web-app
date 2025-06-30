import { ForgotPasswordRequest, ForgotPasswordResponse, LoginRequest, LoginResponse, RegisterRequest } from "@/_interfaces/customer.interface";
import { RegisterResponse } from "@/_interfaces/customer.interface";
import { createApiInstance } from "../api";

const api = createApiInstance(process.env.NEXT_PUBLIC_CUSTOMERS_API_URL);

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/customers/login', payload);
    if(response.status !== 200){
        throw new Error('Failed to login');
    }
    return response.data;
};

export const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/customers/register', payload);
    if(response.status !== 200){
        throw new Error('Failed to register');
    }
    return response.data;
}

export const forgotPassword = async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await api.post('/customers/forgot-password', payload);
    if(response.status !== 200){
        throw new Error('Failed to forgot password');
    }
    return response.data;
}