import React from 'react'
import Hero from "../components/Hero.jsx"
import AiFeatures from '../components/AiFeatures.jsx'
import Footer from "../components/Footer.jsx"
function Home() {
  return (
      <div className="bg-gradient-to-br from-black to-gray-900 text-white min-h-screen w-screen">
        <Hero/>
      <AiFeatures/>
      <Footer/> 
      </div>
  )
}

export default Home