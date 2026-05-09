import axios from "axios";

// Empty VITE_PUBLIC_API_URL means same-origin /api/... — nginx proxies to Django.
// Set VITE_PUBLIC_API_URL=https://api.example.com only if the API lives on a
// different host.
const baseURL =
  (import.meta.env.VITE_PUBLIC_API_URL || "").replace(/\/$/, "") +
  "/api/public/v1";

export const publicClient = axios.create({
  baseURL,
  timeout: 8000,
});
