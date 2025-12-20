import React, { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const toolCards = [
  {
    title: 'Code Review',
    description: 'Get detailed code reviews with suggestions for improvement',
    icon: '🔍',
    path: '/tools/review',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    title: 'Code Explain',
    description: 'Understand complex code with clear explanations',
    icon: '📝',
    path: '/tools/explain',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Learn',
    description: 'Enhance your coding skills with interactive lessons',
    icon: '🎓',
    path: '/tools/learn',
    gradient: 'from-green-500 to-emerald-400'
  },
  {
    title: 'Roadmap',
    description: 'Plan your learning path with personalized roadmaps',
    icon: '🗺️',
    path: '/tools/roadmap',
    gradient: 'from-amber-500 to-yellow-300'
  },
  
];

function Tools() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Let the Layout component handle scrolling
    window.scrollTo(0, 0);
    
    // Clean up any potential scroll listeners
    return () => {
      window.scrollTo(0, 0);
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold tracking-wider text-cyan-400 uppercase">Powerful Development Tools</span>
          <h1 className="mt-2 text-5xl font-bold text-white sm:text-6xl">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Developer Toolkit
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Essential tools to streamline your development workflow and boost productivity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {toolCards.map((tool, index) => (
            <div 
              key={index}
              onClick={() => navigate(tool.path)}
              className={`relative overflow-hidden group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:shadow-${tool.gradient.split(' ')[0].split('-')[1]}-500/20 cursor-pointer`}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                   style={{
                     background: `linear-gradient(135deg, ${tool.gradient.replace('to-', '')})`,
                     zIndex: -1
                   }}>
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-gray-800/50 group-hover:bg-gray-900/50 transition-colors duration-300">
                  {tool.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{tool.title}</h2>
                <p className="text-gray-300 mb-6">{tool.description}</p>
                <div className="flex items-center text-cyan-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Get Started
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-24 mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Developers Love Our Tools</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Optimized for speed with instant results and minimal loading times.'
              },
              {
                icon: '🔒',
                title: 'Secure & Private',
                description: 'Your code never leaves your machine. We prioritize your privacy and security.'
              },
              {
                icon: '🚀',
                title: 'Always Evolving',
                description: 'Regular updates with new features and improvements based on developer feedback.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-cyan-400/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 mt-24">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-2">
                  {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-2">
                  {['Documentation', 'Tutorials', 'API Status', 'Help Center'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Community</h3>
                <ul className="mt-4 space-y-2">
                  {['GitHub', 'Twitter', 'Discord', 'LinkedIn'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Subscribe to our newsletter</h3>
                <p className="mt-4 text-gray-400">The latest news, articles, and resources, sent to your inbox weekly.</p>
                <div className="mt-4 flex">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full"
                  />
                  <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-r-lg transition-all duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm text-center">
                &copy; {new Date().getFullYear()} Code Assistant. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Tools;