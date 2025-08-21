import React, { useState } from "react";
import handyBot from "../assets/handy-resize.png";
import { BsGithub } from "react-icons/bs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/contexts-Files/authContext";

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      await signup(
        formData.fullName,
        formData.username,
        formData.email,
        formData.password
      );
      navigate(from, { replace: true }); // Redirect to the original location after successful signup
      console.log("User signed up:", formData);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <>
      {" "}
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center py-8">
        {/* Header */}
        <div className="text-start mb-6 flex justify-between items-end w-[38%] relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-white text-transparent bg-clip-text ml-4">
            Sign-up
          </h1>
          <img
            src={handyBot}
            alt="Handy Bot"
            className="h-30 w-auto absolute right-0 bottom-[-35px] z-40"
          />
        </div>

        {/* Form */}
        <div className="w-[38%] bg-gray-900/50 rounded backdrop-blur-sm border border-white/10 flex flex-col justify-center py-8">
          <div className="max-w-md mx-auto w-full px-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-lg font-medium text-gray-200 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-lg font-medium text-gray-200 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium text-gray-200 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-lg font-medium text-gray-200 mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-lg font-medium text-gray-200 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded hover:opacity-90 transition-all duration-300 font-semibold text-sm mt-6"
              >
                Create Account
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-4 text-sm">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Social Login */}
            <div className="relative my-4">
              <div className="inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 mt-2 bg-gray-900/50 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-4 w-4 mr-2"
                />
                <span className="text-gray-300 text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center px-3 py-2 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
                <BsGithub className="h-5 w-5 mr-2" />
                <span className="text-gray-300 text-sm">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm text-center mb-4">{error}</div>
      )}
    </>
  );
}

export default SignUp;
