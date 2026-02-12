import React from "react";
import { LuCircleCheckBig } from "react-icons/lu";
function AiFeatureCard({ heading, para, keypoints }) {
  return (
    <div className="box bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-start my-4 mx-2 py-10 gap-3 border border-gray-200">
      <div className="flex flex-col items-start gap-4">
        {/* <img src={icon} alt={"/"} className="w-12 h-12 mr-4" /> */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          {heading}
        </h2>
      </div>
      <p className="text-gray-600 my-4 min-h-20 max-h-20 font-sans text-sm md:text-base">
        {para}
      </p>
      <ul className="flex flex-col items-start gap-3 my-8">
        {keypoints.map((point, index) => (
          <li key={index} className="text-gray-700 text-sm md:text-base">
            <LuCircleCheckBig className="inline-block mr-3 text-green-500" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AiFeatureCard;
