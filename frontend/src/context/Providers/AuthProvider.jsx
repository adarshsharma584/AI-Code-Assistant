import { React, useState } from "react";
import { AuthContext } from "../contexts-Files/authContext";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (fullName, username, email, password) => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, username, email, password }),
        },{
            withCredentials: true,
        }
      );

      const data = await response.json();
      console.log("Signup response:", data);

      if (response.ok) {
        setUser(data.user);
        setToken(data.accessToken);
        localStorage.setItem("token", data.accessToken);
        console.log(" console token:", localStorage.getItem("token"));
        console.log("token:", data.accessToken);
        console.log("User signed up from provider:", data.user);
        return data;
      } else {
        throw new Error(data.message || "Failed to sign up");
      }
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
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },{
        withCredentials: true,
      });

      const data = await response.json();
      console.log("Signin response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in");
      }

      setUser(data.user);
      setToken(data.accessToken);
      localStorage.setItem("token", data.accessToken);
      console.log(" console token:", localStorage.getItem("token"));
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
      const response = await fetch("http://localhost:5000/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      });

      const data = await response.json();
      console.log("Signout response:", data);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } catch (error) {
      throw new Error("Failed to sign out", error);
    }
  };
  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/v1/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    signup,
    signin,
    signout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
