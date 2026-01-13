import React, { useState } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/contexts-Files/authContext";
import toast from 'react-hot-toast';

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await signup(
        formData.fullName,
        formData.username,
        formData.email,
        formData.password
      );
      toast.success("Account created successfully!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  min-h-screen bg-white flex items-center justify-center px-4 relative">
      {/* Back to Home */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 left-6 text-bold text-lg text-gray-600 animate-bounce  hover:text-black transition "
      >
        ← Back to Home
      </button>

      {loading ? (
        <div className=" absolute top-0 left-0 z-10  loader"></div>
      ) : (
        <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%]">
          {/* Header */}

          {/* Card */}
          <div className="bg-white border border-gray-400 rounded-xl shadow-md px-6 py-3 md:px-8 md:py-4">
            <h1 className="text-md md:text-2xl mb-2 text-start font-medium text-gray-700">
              Sign Up
            </h1>
            <div className="h-[2px] bg-gray-500 my-4"></div>
            <form onSubmit={handleSubmit} className="space-y-2">
              {[
                {
                  label: "Full Name",
                  id: "fullName",
                  type: "text",
                  placeholder: "John Doe",
                },
                {
                  label: "Username",
                  id: "username",
                  type: "text",
                  placeholder: "john_doe",
                },
                {
                  label: "Email Address",
                  id: "email",
                  type: "email",
                  placeholder: "john@email.com",
                },
                {
                  label: "Password",
                  id: "password",
                  type: "password",
                  placeholder: "••••••••",
                },
                {
                  label: "Confirm Password",
                  id: "confirmPassword",
                  type: "password",
                  placeholder: "••••••••",
                },
              ].map(({ label, id, type, placeholder }) => (
                <div key={id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={formData[id]}
                    onChange={(e) =>
                      setFormData({ ...formData, [id]: e.target.value })
                    }
                    placeholder={placeholder}
                    required
                    className="w-full px-3 text-gray-800 py-2 border border-gray-300 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             focus:border-blue-500 transition"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700
                         text-white font-semibold rounded-md transition"
              >
                
                  Create Account
              
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>

            {/* Divider */}
            {/* <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200" />
            <span className="px-3 text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-200" />
          </div> */}

            {/* Social Login */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-4 w-4"
              />
              <span className="text-gray-700 text-sm">Google</span>
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              <BsGithub className="h-5 w-5 text-gray-800" />
              <span className="text-gray-700 text-sm">GitHub</span>
            </button>
          </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
