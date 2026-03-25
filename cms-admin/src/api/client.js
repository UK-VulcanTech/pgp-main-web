import axios from "axios";

const base = import.meta.env.VITE_API_BASE ?? "";

export const api = axios.create({
  baseURL: `${base}/api/manage/v1`,
  headers: { "Content-Type": "application/json" },
});

export const publicApi = axios.create({
  baseURL: `${base}/api/public/v1`,
});

const CMS_USER_KEY = "cms_user";

let accessToken = localStorage.getItem("access_token") || "";
let refreshToken = localStorage.getItem("refresh_token") || "";

export function getCmsUser() {
  try {
    const raw = localStorage.getItem(CMS_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCmsUser(obj) {
  if (obj) localStorage.setItem(CMS_USER_KEY, JSON.stringify(obj));
  else localStorage.removeItem(CMS_USER_KEY);
}

export function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh || refreshToken;
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  accessToken = "";
  refreshToken = "";
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem(CMS_USER_KEY);
}

export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

let refreshing = null;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && refreshToken && !orig._retry) {
      orig._retry = true;
      try {
        refreshing =
          refreshing ||
          axios.post(`${base}/api/manage/v1/auth/refresh/`, {
            refresh: refreshToken,
          });
        const { data } = await refreshing;
        refreshing = null;
        setTokens(data.access, null);
        orig.headers.Authorization = `Bearer ${data.access}`;
        return api(orig);
      } catch {
        refreshing = null;
        clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

export async function login(username, password) {
  const { data } = await axios.post(`${base}/api/manage/v1/auth/login/`, {
    username,
    password,
  });
  setTokens(data.access, data.refresh);
  if (data.user) setCmsUser(data.user);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get("/me/");
  setCmsUser(data);
  return data;
}
