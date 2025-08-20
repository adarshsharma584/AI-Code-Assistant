import React from 'react'
import homeBg from '../assets/home-bg.png'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/sign-up');
  };
  const handleLearn = () =>{
    navigate('/about')
  }

  return (
    <div className="h-screen w-screen bg-black flex">
      {/* Left Side - Text Content */}
      <div className="w-1/2 pb-25 h-full flex flex-col justify-center px-16 bg-black text-white">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Revolutionize Your Coding Experience
        </h1>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Experience the power of AI-driven development tools that help you write better code faster. Join thousands of developers who trust Coddy.Dev.
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:opacity-90 transition-all duration-300 font-semibold" onClick={handleGetStarted}>
            Get Started
          </button>
          <button className="px-8 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300" onClick={handleLearn}>
            Learn More
          </button>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 h-full relative overflow-hidden">
        <img 
          src={homeBg} 
          alt="Hero Image" 
          className="h-full w-full object-cover object-center"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/32 to-transparent"></div>
      <hr/>
      </div>
    </div>
  )
}

export default Hero