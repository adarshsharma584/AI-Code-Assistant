import React from "react";
import AiFeatureCard from "./AiFeatureCard";

function AiFeatures() {
  return (
    <div className="bg-white h-full max-w-screen box text-white flex flex-col items-center  justify-center my-4">
      <div className="flex flex-col items-center gap-3 ">
        <h1 className="text-5xl font-bold text-gray-900 ">
          Comprehensive AI Features
        </h1>
        <p className="text-2xl text-gray-600 ">
          Everything you need for modern development in one intelligent platform
        </p>

        <div className="card-section grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12  py-8 mt-8 mx-auto  mb-6 px-4 rounded-lg">
          <AiFeatureCard
            icon={"l"}
            heading={"Smart Code Review"}
            para={
              "Get instant, intelligent feedback on your code with security analysis, performance optimization, and best practice recommendations."
            }
            keypoints={[
              "Advanced security scanning",
              "Performance optimization tips",
              "Best practice enforcement",
            ]}
          />
          <AiFeatureCard
            icon={"l"}
            heading={"Smart Chat History"}
            para={
              "Never lose context with intelligent conversation tracking, search, and organization across all your AI interactions."
            }
            keypoints={[
              "Conversation threading",
              "Intelligent search & filters",
              "Export & sharing options",
            ]}
          />
          <AiFeatureCard
            icon={"l"}
            heading={"AI Quiz Generator"}
            para={
              "Create personalized coding challenges and assessments that adapt to your skill level and learning objectives."
            }
            keypoints={[
              "Adaptive difficulty levels",
              "Multiple question formats",
              "Instant detailed feedback",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default AiFeatures;
