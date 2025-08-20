import React from 'react'

function AiFeatureCard({icon,heading,para,keypoints}) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md h-110  w-90 flex flex-col items-start my-4 mx-2 py-10 gap-3">
     <div className='flex flex-col items-start gap-4'>

        <img src={icon} alt={"/"} className="w-12 h-12 mr-4" />
        <h2 className="text-xl font-semibold text-white ">{heading}</h2>
     </div>
      <p className="text-gray-300 my-4">{para}</p>
      <ul className="flex flex-col items-start gap-3 my-8">
        {keypoints.map((point, index) => (
            <li key={index} className="text-gray-400">{point}</li>
        ))}
      </ul>
       
    </div>
  )
}

export default AiFeatureCard