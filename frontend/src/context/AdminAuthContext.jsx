import React, { createContext, useContext, useState, useEffect } from "react";
import { loginAdmin, logoutAdmin, getAdminMe } from "../api/api";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("leela_admin_token") || null);
  const [loading, setLoading] = useState(true);

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
        } catch (err) {
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
        localStorage.setItem("leela_admin_token", res.data.token);
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
    const activeToken = localStorage.getItem("leela_admin_token");
    if (activeToken) {
      logoutAdmin(activeToken).catch(() => {});
    }
    localStorage.removeItem("leela_admin_token");
    setToken(null);
    setAdmin(null);
  };

  const updateAdminSession = (newAdmin, newToken) => {
    if (newToken) {
      localStorage.setItem("leela_admin_token", newToken);
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
