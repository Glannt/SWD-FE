import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "../types/api";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to headers if available
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/auth";
        return Promise.reject(new Error("Unauthorized access"));
      }

      // Handle server errors
      if (status >= 500) {
        return Promise.reject(new Error("Server error occurred"));
      }

      // Handle validation errors
      if (status === 400) {
        const errorMessage = data.message || "Invalid request";
        return Promise.reject(new Error(errorMessage));
      }
    }

    // Handle network errors
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timeout"));
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiGet = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return api.get(url, config).then((response) => response.data);
};

export const apiPost = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  return api.post(url, data, config).then((response) => response.data);
};

export const apiPut = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  return api.put(url, data, config).then((response) => response.data);
};

export const apiDelete = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return api.delete(url, config).then((response) => response.data);
};

// Error handling utility
export const handleApiError = (error: unknown): ApiError => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response: { status: number; data: { message?: string } };
    };
    return {
      status: axiosError.response.status,
      message: axiosError.response.data?.message || "An error occurred",
      details: axiosError.response.data,
    };
  }

  return {
    status: 0,
    message: error instanceof Error ? error.message : "Network error",
  };
};

export default api;
