import axios from "axios";

const defaultBaseURL = "https://example.com";

const createApiInstance = async (
  headers: Record<string, string>,
  baseURL?: string,
  token?: string
) => {
  const api = axios.create({
    baseURL: baseURL || defaultBaseURL, // Gunakan baseURL custom atau default
    timeout: 10000, // Timeout 10 detik
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return api;
};

export { createApiInstance };
