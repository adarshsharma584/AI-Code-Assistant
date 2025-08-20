import React from 'react'
import { LuCircleCheckBig } from "react-icons/lu";
function AiFeatureCard({icon,heading,para,keypoints}) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md h-110  w-90 flex flex-col items-start my-4 mx-2 py-10 gap-3">
     <div className='flex flex-col items-start gap-4'>

        <img src={icon} alt={"/"} className="w-12 h-12 mr-4" />
        <h2 className="text-[23px] font-semibold text-white ">{heading}</h2>
     </div>
      <p className="text-gray-200 my-4 min-h-20 max-h-20 font-sans">{para}</p>
      <ul className="flex flex-col items-start gap-3 my-8">
        {keypoints.map((point, index) => (

            <li key={index} className="text-gray-400 text-[14px]"><LuCircleCheckBig className="inline-block mr-3 text-green-400" />{point}</li>
        ))}
      </ul>
       
    </div>
  )
}

export default AiFeatureCard