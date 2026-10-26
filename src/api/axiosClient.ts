import axios from "axios";
import { normalizeApiError } from "./apiErrors";
import { mockAdapter } from "./mock/mockAdapter";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  // When no API base URL is configured, serve mock data at the transport layer
  // so the app is fully functional before the backend exists.
  ...(baseURL ? {} : { adapter: mockAdapter }),
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);

export default axiosClient;
