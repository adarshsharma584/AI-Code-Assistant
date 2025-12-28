import React from "react";
import { Link,NavLink } from "react-router-dom";
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
    <div className="min-h-screen bg-white text-gray-800">
      {/* ================= HERO ================= */}
      <section className=" mt-20 pt-12 min-h[calc(100vh_-_12rem)] max-h-screen ">
        <div className="container mx-auto px-6 max-w-5xl  text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-blue-600">Coddy.Dev</span>?
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Coddy.Dev is a smart and secure platform designed to help developers
            write better code, learn faster, and collaborate efficiently.
            Whether you are a beginner or a professional, Coddy.Dev simplifies
            development with powerful and reliable tools.
          </p>

          <p className="text-lg text-gray-600 mt-6">
            Our platform bridges the gap between learning, coding, and
            real-world software development by offering intelligent tools,
            structured guidance, and seamless collaboration in one place.
          </p>
        </div>
        <div className="flex justify-center items-center text-center gap-4 pb-6 pt-2 mt-6 mb-10">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform active:scale-95">
            <Link to="/sign-up">Get Started</Link>
          </button>
          <button className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition duration-300 ease-in-out transform active:scale-95 ml-4">
            <Link to="/tools">Explore Tools</Link>
          </button>
        </div>
        <div className="box h-[2px] rounded-xl  bg-gray-400"></div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Our mission is to make software development more accessible,
            efficient, and transparent. We aim to empower developers with the
            right tools, insights, and workflows so they can focus on building
            meaningful and high-quality software.
          </p>
        </div>
      </section>

      <div className="flex max-w-[80vw] mx-auto md:flex-row gap-8 mb-16">
        {/* ================= PROBLEM ================= */}
        <section className="py-10  bg-red-400  border-2  rounded-md">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">
              The Problems We Solve
            </h2>

            <div className="flex md:flex-col flex-row gap-3">
              {[
                "Finding reliable and well-structured developer tools for learning and productivity.",
                "Lack of clear progress tracking while learning new technologies.",
                "Inefficient collaboration and communication within development teams.",
                "Wasting time on unorganized resources and low-quality coding platforms.",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6  rounded-lg bg-white shadow-sm"
                >
                  <FiCheckCircle className="text-blue-600 mt-1" size={22} />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SOLUTION ================= */}
        <section className="py-10 bg-green-300  border-2  rounded-md">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-4xl font-bold mb-12  text-white text-center">
              Our Solution
            </h2>

            <div className="flex md:flex-col flex-row gap-3">
              {[
                "A curated set of intelligent and secure developer tools.",
                "Personalized dashboards to track learning progress and productivity.",
                "Clear insights through analytics, reports, and performance tracking.",
                "Seamless collaboration with built-in communication features.",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-lg bg-white shadow-sm"
                >
                  <FiCheckCircle className="text-green-600 mt-1" size={22} />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="box h-1 rounded-xl  bg-gray-700"></div>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 mb-8">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Why Choose Coddy.Dev?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 ">
            {[
              {
                icon: <FiShield size={26} />,
                title: "Secure Platform",
                desc: "Enterprise-grade security to keep your code and data private.",
              },
              {
                icon: <FiBarChart2 size={26} />,
                title: "Progress Tracking",
                desc: "Track your learning and productivity with clear insights.",
              },
              {
                icon: <FiMessageSquare size={26} />,
                title: "Seamless Collaboration",
                desc: "Smooth communication between developers and teams.",
              },
              {
                icon: <FiMapPin size={26} />,
                title: "Flexible Usage",
                desc: "Use tools locally or online from anywhere.",
              },
              {
                icon: <FiCpu size={26} />,
                title: "AI-Powered Tools",
                desc: "Smart suggestions tailored to your coding workflow.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-8 border rounded-xl bg-white shadow-sm"
              >
                <div className="text-blue-600 mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="box h-1 rounded-xl  bg-gray-700"></div>

      {/* ================= VISION ================= */}
      <section className="max-w-[80vw] flex mx-auto py-12 my-10 bg-gray-200 rounded-3xl">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl text-gray-600 italic leading-relaxed">
            “We believe that coding should be intuitive, transparent, and
            accessible. By combining modern technology with thoughtful design,
            Coddy.Dev envisions a future where every developer can build with
            confidence and clarity.”
          </p>
        </div>
      </section>

      {/* ================= FOUNDERS ================= */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Founders of Coddy.Dev
          </h2>

          <div className="grid md:grid-cols-3 gap-8 ">
            {["Adarsh Sharma", "Adarsh Sharma", "Adarsh Sharma"].map(
              (name, index) => (
                <div
                  key={index}
                  className="p-8 border rounded-xl text-center bg-white shadow-sm"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">{name}</h3>
                  <p className="text-gray-600">Project Lead</p>
                  <p className="text-gray-500 mt-3">
                    Passionate about bridging technology with real-world impact.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-[80vw] mx-auto  pt-12 pb-4 border-t border-gray-400 ">
        <div className="container mx-auto px-6 text-center max-w-3xl ">
          <h2 className="text-4xl font-bold mb-6">Start Your Journey Today</h2>
          <p className="text-xl text-gray-600 mb-8">
            Build smarter, learn faster, and grow as a developer with Coddy.Dev.
          </p>

          <Link
            to="/sign-up"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
       
    </div>
  );
}

export default About;
