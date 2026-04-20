import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const PILARGROUP_URL = import.meta.env.VITE_PILARGROUP_URL || "https://pilargroup.id";
const TOKEN_KEY = "bf_token";
const USER_KEY = "bf_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set default Authorization header untuk semua axios request
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Intercept 401 → logout
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

  // Cek token dari URL (setelah redirect dari pilargroup)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      // Bersihkan token dari URL
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());

      saveToken(tokenFromUrl);
      return;
    }

    // Kalau sudah ada token di storage, verifikasi ke backend
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const saveToken = useCallback(async (newToken) => {
    setLoading(true);
    setError(null);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    await verifyToken(newToken);
  }, []);

  const verifyToken = async (tkn) => {
    try {
      const res = await axios.get("/progress/__ping__", {
        headers: { Authorization: `Bearer ${tkn}` },
        validateStatus: (s) => s !== 401,
      }).catch(async () => {
        // Fallback: verifikasi langsung ke pilargroup
        return axios.get(`${PILARGROUP_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${tkn}` },
        });
      });

      if (res.status === 401) {
        throw new Error("Token expired");
      }

      // Ambil data user dari pilargroup
      const meRes = await axios.get(`${PILARGROUP_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${tkn}` },
      });

      const userData = meRes.data;
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, tkn);
      setToken(tkn);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const redirectToLogin = useCallback(() => {
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `${PILARGROUP_URL}?redirect=${returnUrl}`;
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, logout, redirectToLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}