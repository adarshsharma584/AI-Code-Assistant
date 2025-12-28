import React, { useState } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/contexts-Files/authContext";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signin } = useAuth();
  const location = useLocation();

  // Get the redirect path from location state or use the current path
  const from = location.state?.from || "/";
  console.log("SignIn location state:", location.state);
  console.log("Current pathname:", location.pathname);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signin(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative">
      {/* Back to Home */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 left-6 text-bold text-lg text-gray-600 animate-bounce  hover:text-black transition "
      >
        ← Back to Home
      </button>

      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[40%]">
        {/* Header */}

        {/* Card */}
        {loading ? (<div className=" absolute top-0 left-0 z-10  loader"></div>) :
          (<div className="bg-white border border-gray-400 rounded-xl shadow-md px-6 py-3 md:px-8 md:py-4">
            <h1 className="text-md md:text-2xl mb-2 text-start font-medium text-gray-700">
              Sign In
            </h1>
            <div className="h-[2px] bg-gray-500 my-4"></div>
            <form onSubmit={handleSubmit} className="space-y-2">
              {[
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
                    className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-md
                               focus:outline-none focus:ring-2 focus:ring-blue-500
                               focus:border-blue-500 transition"
                  />
                </div>
              ))}

              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
              
                className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700
                           text-white font-semibold rounded-md transition"
              >
                Sign-in
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>

          
          </div>)}
      </div>
    </div>
  );
}

export default SignIn;
