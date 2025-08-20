import React from 'react'
import Hero from "../components/Hero.jsx"
import AiFeatures from '../components/AiFeatures.jsx'
function Home() {
  return (
      <div className="bg-gradient-to-br from-black to-gray-900 text-white min-h-screen">
        <Hero/>
      <AiFeatures/>
      </div>
  )
}

export default Home