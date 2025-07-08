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
  if (response.status !== 200) {
    throw new Error("Failed to login");
  }
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
  if (response.status !== 200) {
    throw new Error("Failed to register");
  }
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
  if (response.status !== 200) {
    throw new Error("Failed to forgot password");
  }
  return response.data;
};

export const getCustomer = async (
  token: string,
  headers: Record<string, string>
): Promise<CustomerResponse> => {
  "use cache";
  try {
    const api = await createApiInstance(
      headers,
      process.env.NEXT_PUBLIC_CUSTOMERS_API_URL,
      token
    );
    const response = await api.get("/customers/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};
