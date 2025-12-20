import { React, useState, useEffect } from "react";
import { AuthContext } from "../contexts-Files/authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial auth check
  useEffect(() => {
    const verifyAuth = async () => {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        setUser(null);
        setLoading(false);
        setIsInitialized(true);
        return;
      }

      try {
        const response = await fetch(
          "https://ai-code-assistant-one.vercel.app/api/v1/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setToken(currentToken);
        } else {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      verifyAuth();
    }
  }, []); // Only run on mount

  // Sign up function
  const signup = async (fullName, username, email, password) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://ai-code-assistant-one.vercel.app/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, username, email, password }),
          credentials: "include", // Include cookies in request
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://ai-code-assistant-one.vercel.app/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Include cookies in request
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in");
      }

      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signout = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) return;

      const response = await fetch(
        "https://ai-code-assistant-one.vercel.app/api/v1/auth/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in request
        }
      );

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Signout error:", error);
      // Still clear local state even if server request fails
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  // Add myProfile function
  const myProfile = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      if (!currentToken) return;

      const response = await fetch(
        "https://ai-code-assistant-one.vercel.app/api/v1/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        throw new Error(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
      throw error;
    }
  };

  // Modify the value object
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

  // Don't render children until initial auth check is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
