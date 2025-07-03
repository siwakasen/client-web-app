import axios from 'axios';

const defaultBaseURL =
  process.env.NEXT_PUBLIC_API_URL || 'https://example.com';
 
const createApiInstance = (baseURL?: string) => {
  const api = axios.create({
    baseURL: baseURL || defaultBaseURL, // Gunakan baseURL custom atau default
    timeout: 10000, // Timeout 10 detik
  });

  // Request Interceptor
  api.interceptors.request.use(
    (config) => {
      let token;
      if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

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

// Default API instance menggunakan baseURL dari env atau fallback
const api = createApiInstance();

export { api, createApiInstance };
