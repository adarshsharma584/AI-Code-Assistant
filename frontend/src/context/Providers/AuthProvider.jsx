import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts-Files/authContext";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔹 Verify auth on first load
  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setLoading(false);
        setIsInitialized(true);
        return;
      }

      try {
        const res = await api.get("/users/me");
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    verifyAuth();
  }, []);

  // 🔹 Signup
  const signup = async (fullName, username, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        fullName,
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);

      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Signin
  const signin = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);

      return res.data;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Signout
  const signout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {
      // ignore server error
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  // 🔹 Get profile manually
  const myProfile = async () => {
    const res = await api.get("/users/me");
    setUser(res.data.user);
    return res.data.user;
  };

  const value = {
    user,
    token,
    loading,
    isInitialized,
    signup,
    signin,
    signout,
    myProfile,
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
