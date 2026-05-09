import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { cms, login as apiLogin, logout as apiLogout, tokenStore } from "../api/client";

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {}, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!tokenStore.access) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const r = await cms.get("/me/");
      setUser(r.data);
    } catch {
      setUser(null);
      tokenStore.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (username, password) => {
      await apiLogin(username, password);
      await refresh();
    },
    [refresh]
  );

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
