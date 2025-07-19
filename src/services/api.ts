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
      console.log(error);
      // If the error has a response with data, return it so we can access the message
      if (error.response && error.response.data) {
        // Create a custom error that includes the backend response
        const customError = new Error();
        customError.message = error.response.data.message || error.message;
        customError.name = "ApiError";
        (customError as any).status = error.response.status;
        (customError as any).data = error.response.data;
        return Promise.reject(customError);
      }

      return Promise.reject(error);
    }
  );
  return api;
};

export { createApiInstance };
