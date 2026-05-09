import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") + "/api/manage/v1";
export const PUBLIC_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "") + "/api/public/v1";

export const cms = axios.create({ baseURL: API_BASE, timeout: 12_000 });

const ACCESS_KEY = "pgp_cms_access";
const REFRESH_KEY = "pgp_cms_refresh";

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set({ access, refresh }) {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

cms.interceptors.request.use((config) => {
  const t = tokenStore.access;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

let refreshing = null;
async function refreshAccess() {
  if (!tokenStore.refresh) return null;
  if (refreshing) return refreshing;
  refreshing = axios
    .post(`${API_BASE}/auth/refresh/`, { refresh: tokenStore.refresh })
    .then((r) => {
      tokenStore.set({ access: r.data.access });
      return r.data.access;
    })
    .catch(() => {
      tokenStore.clear();
      return null;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

cms.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    if (status === 401 && !original._retried && original.url && !original.url.includes("/auth/")) {
      original._retried = true;
      const next = await refreshAccess();
      if (next) {
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${next}` };
        return cms(original);
      }
    }
    return Promise.reject(error);
  }
);

export async function login(username, password) {
  const r = await axios.post(`${API_BASE}/auth/login/`, { username, password });
  tokenStore.set({ access: r.data.access, refresh: r.data.refresh });
}
export function logout() {
  tokenStore.clear();
}
