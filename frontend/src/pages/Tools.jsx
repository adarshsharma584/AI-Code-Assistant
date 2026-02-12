import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const toolCards = [
  {
    title: "Roadmap",
    description:
      "Follow a clear, goal-oriented roadmap tailored to your learning path.",
    icon: "🗺️",
    path: "/tools/roadmap",
  },
  {
    title: "Learn",
    description:
      "Create detailed notes with clear explanation & in beginner friendly tone.",
    icon: "🎓",
    path: "/tools/learn",
  },
  {
    title: "Code Review",
    description:
      "Get structured reviews with best practices, performance tips, and clean architecture suggestions.",
    icon: "🔍",
    path: "/tools/review",
  },
  {
    title: "Code Explain",
    description:
      "Break down complex logic into simple, human-readable explanations.",
    icon: "📝",
    path: "/tools/explain",
  },
  {
    title: "Learn",
    description:
      "Learn programming concepts step-by-step with practical clarity.",
    icon: "🎓",
    path: "/tools/learn",
  },
 
];

function Tools() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-white/10 min-h-screen">
      {/* ================= HERO ================= */}
      <section className="pt-24 pb-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-wider text-gray-500 font-medium">
            Developer Toolkit
          </p>

          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
            Tools that help you understand,
            <br className="hidden sm:block" /> improve & grow as a developer
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Built for developers who value clarity, clean code, and continuous
            learning — without unnecessary complexity.
          </p>
        </div>
      </section>

      {/* ================= TOOLS ================= */}
      <section className="py-6 bg-white/10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {toolCards.map((tool, index) => (
              <div
                key={index}
                onClick={() => navigate(tool.path)}
                className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-6
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                    {tool.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {tool.title}
                  </h2>
                </div>

                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {tool.description}
                </p>

                <span className="text-sm font-medium text-indigo-600 group-hover:underline">
                  Explore →
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHO IS THIS FOR ================= */}
      <section className=" py-8 px-4 border border-gray-300 rounded-lg mt-4 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-14">
            Who is this for?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Beginners",
                desc: "Understand code logic instead of memorizing syntax.",
              },
              {
                title: "Students",
                desc: "Learn concepts clearly and prepare confidently for interviews.",
              },
              {
                title: "Working Developers",
                desc: "Review, refactor, and improve production-level code.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-400 rounded-xl p-8 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW DEVELOPERS USE IT ================= */}
      <section className="max-w-[80vw]  mx-auto py-8 my-4 bg-gray-50  px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-14">
            How developers use these tools
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "Write Code",
                desc: "Build features, solve problems, or practice coding.",
              },
              {
                title: "Analyze & Understand",
                desc: "Review, explain, and break down complex logic.",
              },
              {
                title: "Improve & Learn",
                desc: "Refactor, optimize, and grow your understanding.",
              },
            ].map((step, i) => (
              <div key={i} className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-gray-300 flex items-center justify-center font-semibold text-gray-800">
                  {i + 1}
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-[80vw] mx-auto py-8 my-4 px-4 border border-gray-200 rounded-lg">
        <div className="max-w-3xl mx-auto text-center border-t pt-20">
          <h2 className="text-3xl font-semibold text-gray-900">
            Start improving your code today
          </h2>
          <p className="mt-4 text-gray-600">
            No setup. No distractions. Just tools that make coding clearer.
          </p>
          <button
            onClick={() => navigate("/sign-up")}
            className="mt-8 px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
     
    </div>
  );
}

export default Tools;
