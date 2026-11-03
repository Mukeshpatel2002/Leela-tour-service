import React, { createContext, useContext, useState, useEffect } from "react";
import {
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  TOKEN_KEY,
  ADMIN_SESSION_EXPIRED_EVENT,
} from "../api/api";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // Drop a session the server has already rejected. No /auth/logout call: the
  // token is dead, so asking the server to invalidate it would just 401 again.
  useEffect(() => {
    const clearExpiredSession = () => {
      if (!localStorage.getItem(TOKEN_KEY)) return;
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setAdmin(null);
    };
    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, clearExpiredSession);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, clearExpiredSession);
  }, []);

  // Check existing session
  useEffect(() => {
    const fetchAdmin = async () => {
      if (token) {
        try {
          const res = await getAdminMe();
          if (res.data?.success) {
            setAdmin(res.data.admin);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    fetchAdmin();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await loginAdmin({ email, password });
      if (res.data?.success) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setToken(res.data.token);
        setAdmin(res.data.admin);
        return { success: true };
      }
      return { success: false, message: res.data?.message || "Login failed" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid email or password",
      };
    }
  };

  const logout = () => {
    // Invalidate the token server-side so a stolen token cannot be replayed.
    const activeToken = localStorage.getItem(TOKEN_KEY);
    if (activeToken) {
      logoutAdmin(activeToken).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  };

  const updateAdminSession = (newAdmin, newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    }
    if (newAdmin) {
      setAdmin(newAdmin);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        updateAdminSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
