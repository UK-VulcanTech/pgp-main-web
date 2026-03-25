/* eslint-disable react-refresh/only-export-components -- hook colocated with provider */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearTokens,
  fetchMe,
  getAccessToken,
  getCmsUser,
  login as apiLogin,
  setCmsUser,
} from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAccessToken());
  const [user, setUser] = useState(() => getCmsUser());
  const [authReady, setAuthReady] = useState(() => !getAccessToken());

  useEffect(() => {
    if (!token) {
      setUser(null);
      setCmsUser(null);
      setAuthReady(true);
      return undefined;
    }
    let cancelled = false;
    setAuthReady(false);
    fetchMe()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) {
          clearTokens();
          setToken("");
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const canAccessSection = useCallback(
    (section) => {
      if (section == null || section === "") return true;
      if (section === "users") return Boolean(user?.is_superuser);
      if (user?.is_superuser) return true;
      const list = user?.cms_sections;
      return Array.isArray(list) && list.includes(section);
    },
    [user]
  );

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) return null;
    try {
      const u = await fetchMe();
      setUser(u);
      return u;
    } catch {
      return null;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      authReady,
      isAuthed: Boolean(token),
      isSuperuser: Boolean(user?.is_superuser),
      canAccessSection,
      refreshUser,
      async login(username, password) {
        await apiLogin(username, password);
        setToken(getAccessToken());
        setUser(getCmsUser());
      },
      logout() {
        clearTokens();
        setToken("");
        setUser(null);
      },
    }),
    [token, user, authReady, canAccessSection, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}
