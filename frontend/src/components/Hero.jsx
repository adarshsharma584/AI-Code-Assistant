import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className=" box h-[calc(100vh-12rem)]  overflow-hidden relative z-10 p-4  min-h-screen flex items-start justify-center px-4 py-1 mx-auto">
      <div className="w-full max-w-5xl text-center bg-white rounded-2xl   md:p-4">
        {/* Small Tag */}
        <p className="inline-block text-center mb-3 text-sm font-medium text-gray-500 tracking-wide">
          AI-Powered Coding Platform
        </p>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-800  text-center leading-tight ">
          Revolutionize Your
        </h1>

        <h2 className="mt-2 text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 text-center animate-bounce">
          Coding Experience
        </h2>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Build faster with intelligent developer tools designed to improve
          productivity and code quality. Trusted by developers worldwide.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/sign-up")}
            className="px-8 py-3 rounded-md bg-black text-white font-medium hover:bg-gray-800 transition hover:cursor-pointer"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/about")}
            className="px-8 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-500 transition hover:text-white hover:cursor-pointer"
          >
            Learn More
          </button>
        </div>

        {/* Divider */}
        {/* <div className="mt-14 border-t border-gray-200 w-24 mx-auto"></div> */}

        {/* Trust Text */}
        <p className="mt-8 text-sm text-gray-500">
          Trusted by thousands of developers worldwide
        </p>
      </div>
    </section>
  );
}

export default Hero;
