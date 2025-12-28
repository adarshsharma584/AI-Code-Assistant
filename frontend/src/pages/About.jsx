import React from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiShield,
  FiBarChart2,
  FiMessageSquare,
  FiMapPin,
  FiCpu,
} from "react-icons/fi";

function About() {
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            What is <span className="text-blue-600">Coddy.Dev</span>?
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Coddy.Dev is a smart and secure platform designed to help developers
            write better code, learn faster, and collaborate efficiently.
          </p>

          <p className="text-base sm:text-lg text-gray-600 mt-6">
            We bridge the gap between learning, coding, and real-world software
            development using intelligent tools and structured guidance.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link
              to="/sign-up"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition text-center"
            >
              Get Started
            </Link>
            <Link
              to="/tools"
              className="bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition text-center"
            >
              Explore Tools
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our mission is to make software development more accessible,
            efficient, and transparent by empowering developers with the right
            tools and workflows.
          </p>
        </div>
      </section>

      {/* ================= PROBLEM & SOLUTION ================= */}
      <section className="py-16">
        <div className="max-w-[80vw] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem */}
          <div className="bg-red-500 rounded-xl p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">
              Problems We Solve
            </h2>
            <div className="space-y-4">
              {[
                "Finding reliable and structured developer tools",
                "Lack of progress tracking",
                "Poor collaboration in teams",
                "Unorganized learning resources",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 bg-white p-4 rounded-lg">
                  <FiCheckCircle className="text-red-500 mt-1" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="bg-green-500 rounded-xl p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">
              Our Solution
            </h2>
            <div className="space-y-4">
              {[
                "Curated intelligent tools",
                "Personalized dashboards",
                "Clear analytics & insights",
                "Built-in collaboration",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 bg-white p-4 rounded-lg">
                  <FiCheckCircle className="text-green-600 mt-1" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-16 text-center">
            Why Choose Coddy.Dev?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiShield />,
                title: "Secure Platform",
                desc: "Enterprise-grade security",
              },
              {
                icon: <FiBarChart2 />,
                title: "Progress Tracking",
                desc: "Clear learning insights",
              },
              {
                icon: <FiMessageSquare />,
                title: "Collaboration",
                desc: "Team communication",
              },
              {
                icon: <FiMapPin />,
                title: "Flexible Usage",
                desc: "Access anywhere",
              },
              {
                icon: <FiCpu />,
                title: "AI Tools",
                desc: "Smart coding assistance",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border rounded-xl bg-white shadow-sm">
                <div className="text-blue-600 mb-4 text-2xl">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VISION ================= */}
      <section className="py-16">
        <div className="max-w-[80vw] mx-auto px-6 bg-gray-100 rounded-3xl py-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Vision</h2>
          <p className="text-lg text-gray-600 italic">
            “Coding should be intuitive, transparent, and accessible for every
            developer.”
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 border-t">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Build smarter, learn faster, and grow with Coddy.Dev.
          </p>

          <Link
            to="/sign-up"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
