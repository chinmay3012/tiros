import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => window.localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      const raw = window.localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      window.localStorage.setItem("token", token);
    } else {
      window.localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    try {
      if (user) {
        window.localStorage.setItem("user", JSON.stringify(user));
      } else {
        window.localStorage.removeItem("user");
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      // Expecting { token, user }
      setToken(res.data?.token || "");
      setUser(res.data?.user || null);
      return { success: true };
    } catch (error) {
      // Clear any stale auth data on login failure
      setToken("");
      setUser(null);
      return { success: false, message: error?.response?.data?.message || "Login failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    try {
      await api.post("/users/register", payload);
      return { success: true };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    window.location.href = "/login";
  };

  const clearAuthData = () => {
    setToken("");
    setUser(null);
    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    } catch (error) {
      // ignore
    }
  };

  const value = useMemo(
    () => ({ token, user, isLoading, isAuthenticated: !!token, login, register, logout, clearAuthData }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


