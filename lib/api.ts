/**
 * Centralized Axios HTTP client for API communication.
 *
 * Configured to:
 * - Send requests to the backend API base URL (from environment)
 * - Automatically include credentials (cookies) on all requests via `withCredentials: true`
 * - Handle global authentication errors (e.g., expired sessions)
 *
 * This client is used by all services that interact with the backend.
 */

import { useAuthStore } from "@/store/auth";
import axios from "axios";

/**
 * Configured Axios instance for authenticated API calls.
 *
 * - Base URL is set via `NEXT_PUBLIC_API_BASE_URL` environment variable.
 * - Credentials (HTTP-only cookies) are automatically sent with every request.
 * - Includes a response interceptor to handle 401 Unauthorized errors globally.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

/**
 * Global response interceptor to handle authentication errors.
 *
 * When a 401 Unauthorized response is received (e.g., due to an expired or invalid session):
 * - The global authentication state is cleared via `useAuthStore.logout()`
 * - The UI automatically updates (e.g., navbar switches to guest mode)
 * - No redirect is performed — the user remains on the current page
 *
 * This enables a seamless, reactive auth experience without full-page navigation.
 */
api.interceptors.response.use(
  // Pass through successful responses
  (response) => response,
  // Handle errors
  (error) => {
    if (error.response?.status === 401) {
      // Clear authenticated state globally
      const auth = useAuthStore.getState();
      auth.logout();
    }
    // Re-throw error for component-level handling (e.g., showing toast)
    return Promise.reject(error);
  }
);

export default api;