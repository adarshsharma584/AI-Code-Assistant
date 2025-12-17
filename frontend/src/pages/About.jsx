import React from 'react';
import { Link } from 'react-router-dom';
import { FiCode, FiUsers, FiZap, FiShield } from 'react-icons/fi';

function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[84.5vh] flex items-start ">
        <div className="absolute inset-0 z-0">
          {/* <img 
            src={homeBg} 
            alt="AI Assistant Background" 
            className="w-full h-full object-cover opacity-20"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"></div>
        </div>
        <div className="absolute bottom-0 h-4 w-screen bg-gradient-to-r from-black/60 via-red-900 to-black/60"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center  mt-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              About Coddy.Dev
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Empowering developers with AI-driven tools to write better code, faster.
              Our mission is to revolutionize the way developers interact with code.
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/sign-up" 
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:opacity-90 transition-all duration-300 font-semibold"
              >
                Get Started
              </Link>
              <Link 
                to="/tools" 
                className="px-8 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Explore Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
     
      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-black via-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              We're on a mission to transform the way developers write and interact with code. 
              By leveraging cutting-edge AI technology, we're creating intelligent tools that 
              understand your coding needs and help you build better software, faster.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              {
                icon: <FiCode className="w-8 h-8 mb-4" />,
                title: "Smart Code Completion",
                description: "AI-powered suggestions that understand your coding style and project context."
              },
              {
                icon: <FiUsers className="w-8 h-8 mb-4" />,
                title: "Collaborative Environment",
                description: "Seamless collaboration tools for teams of all sizes."
              },
              {
                icon: <FiZap className="w-8 h-8 mb-4" />,
                title: "Lightning Fast",
                description: "Optimized performance that keeps up with your fastest coding sessions."
              },
              {
                icon: <FiShield className="w-8 h-8 mb-4" />,
                title: "Secure & Private",
                description: "Your code stays yours with enterprise-grade security measures."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300">
                <div className="text-purple-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="h-4 w-screen bg-gradient-to-r from-black/60 via-red-900 to-black/60"></div>
      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A dedicated team of AI researchers, engineers, and developers passionate about the future of coding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Alex Chen",
                role: "CEO & Founder",
                bio: "Former Google AI researcher with a vision for the future of developer tools."
              },
              {
                name: "Jamie Park",
                role: "CTO",
                bio: "Expert in machine learning and natural language processing."
              },
              {
                name: "Taylor Smith",
                role: "Lead Developer",
                bio: "Full-stack developer with a passion for creating intuitive developer experiences."
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-purple-400 mb-3">{member.role}</p>
                <p className="text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Coding Experience?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join thousands of developers who are already building the future with our AI-powered tools.
          </p>
          <Link 
            to="/sign-up" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:opacity-90 transition-all duration-300 font-semibold text-lg"
          >
            Start Coding Smarter Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;