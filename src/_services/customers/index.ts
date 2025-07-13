"use server";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  CustomerResponse,
} from "@/_interfaces/customer.interface";
import { RegisterResponse } from "@/_interfaces/customer.interface";
import { createApiInstance } from "../api";

export const login = async (
  payload: LoginRequest,
  headers: Record<string, string>
): Promise<LoginResponse> => {
  const api = await createApiInstance(
    headers,
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL
  );
  const response = await api.post("/customers/login", payload);
  return response.data;
};

export const register = async (
  payload: RegisterRequest,
  headers: Record<string, string>
): Promise<RegisterResponse> => {
  const api = await createApiInstance(
    headers,
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL
  );
  const response = await api.post("/customers/register", payload);

  return response.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordRequest,
  headers: Record<string, string>
): Promise<ForgotPasswordResponse> => {
  const api = await createApiInstance(
    headers,
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL
  );
  const response = await api.post("/customers/forgot-password", payload);
  return response.data;
};

export const getCustomer = async (
  token: string,
  headers: Record<string, string>
): Promise<CustomerResponse> => {
  const api = await createApiInstance(
    headers,
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL,
    token
  );
  const response = await api.get("/customers/me");
  return response.data;
};
