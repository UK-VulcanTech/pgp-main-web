import axios from "axios";

const root = (import.meta.env.VITE_PUBLIC_API_URL || "").replace(/\/$/, "");

/**
 * Public CMS JSON — no auth.
 * Dev: same-origin `/api/public/v1` + Vite proxy to Django.
 * Prod: set VITE_PUBLIC_API_URL=https://api.example.com (no trailing slash).
 */
export const publicApi = axios.create({
  baseURL: root ? `${root}/api/public/v1` : "/api/public/v1",
  headers: { Accept: "application/json" },
});
