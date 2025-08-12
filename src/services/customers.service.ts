"use server";
import {
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  CustomerResponse,
  RegisterResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/interfaces";
import { createApiInstance } from "./api";

export const login = async (
  payload: LoginRequest,
  headers: Record<string, string>
): Promise<LoginResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL,
    headers
  );
  const response = await api.post("/customers/login", payload);
  return response.data;
};

export const register = async (
  payload: RegisterRequest,
  headers: Record<string, string>
): Promise<RegisterResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL,
    headers
  );
  const response = await api.post("/customers/register", payload);

  return response.data;
};

export const forgetPassword = async (
  payload: ForgetPasswordRequest,
  headers: Record<string, string>
): Promise<ForgetPasswordResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL,
    headers
  );
  const response = await api.post("/customers/forget-password", payload);
  return response.data;
};

export const changePassword = async (
  payload: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL
  );

  const response = await api.post("/customers/change-password", payload);
  return response.data;
};

export const getCustomer = async (
  token: string,
  headers: Record<string, string>
): Promise<CustomerResponse> => {
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL,
    headers,
    token
  );
  const response = await api.get("/customers/me");
  return response.data;
};

export const uploadIdentityFile = async (
  identityFile: File[],
  token: string,
): Promise<string> => {
  const formData = new FormData();
  identityFile.forEach((file) => {
    formData.append("identity-file", file);
  });
  const api = await createApiInstance(
    process.env.NEXT_PUBLIC_CUSTOMERS_API_URL,
    {},
    token
  );
  const response = await api.post(`/customers/upload-identity-file`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};  