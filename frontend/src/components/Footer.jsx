import { NavLink } from 'react-router-dom';

function Footer() {
  return (
    <footer className=" w-screen bg-gradient-to-br from-black to-gray-900 text-white py-16 relative overflow-hidden">
      

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section with Logo and Description */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text mb-4">
            Coddy.Dev
          </h2>
          <p className="text-gray-200 mt-4 max-w-2xl mx-auto text-lg">
            Empowering developers with cutting-edge AI solutions and tools to build the future of technology.
          </p>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Quick Links */}
          <div className="bg-white/6 p-6 rounded-md backdrop-blur-sm h-80">
            <h4 className="text-xl font-bold text-blue-400 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['About Us', 'Pricing', 'Tools', 'Blog'].map((item) => (
                <li key={item}>
                  <NavLink to={`/${item.toLowerCase().replace(' ', '')}`} 
                    className="text-gray-200 hover:text-blue-400 transition-all duration-300 flex items-center group">
                    <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                      → {item}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
            <h4 className="text-xl font-bold text-purple-400 mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {['Documentation', 'API Reference', 'Community', 'Support'].map((item) => (
                <li key={item}>
                  <NavLink to={`/${item.toLowerCase()}`} 
                    className="text-gray-200 hover:text-purple-400 transition-all duration-300 flex items-center group">
                    <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                      → {item}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
            <h4 className="text-xl font-bold text-green-400 mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 group hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center">
                  <i className="fas fa-envelope text-green-400"></i>
                </div>
                <span className="text-gray-200 group-hover:text-green-400 transition-colors duration-300">
                  contact@coddy.dev
                </span>
              </li>
              <li className="flex items-center space-x-3 group hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center">
                  <i className="fas fa-phone text-green-400"></i>
                </div>
                <span className="text-gray-200 group-hover:text-green-400 transition-colors duration-300">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center space-x-3 group hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-green-400"></i>
                </div>
                <span className="text-gray-200 group-hover:text-green-400 transition-colors duration-300">
                  New York, USA
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm">
            <h4 className="text-xl font-bold text-pink-400 mb-6">
              Connect With Us
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: 'twitter', color: 'bg-blue-400', hover: 'hover:bg-blue-500', link: 'https://twitter.com' },
                { icon: 'github', color: 'bg-gray-600', hover: 'hover:bg-gray-700', link: 'https://github.com' },
                { icon: 'linkedin', color: 'bg-blue-600', hover: 'hover:bg-blue-700', link: 'https://linkedin.com' },
                { icon: 'discord', color: 'bg-indigo-500', hover: 'hover:bg-indigo-600', link: 'https://discord.com' }
              ].map((social) => (
                <a key={social.icon} 
                   href={social.link} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className={`${social.color} ${social.hover} p-4 rounded-lg flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-${social.color}/50`}>
                  <i className={`fab fa-${social.icon} text-white text-2xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-8 backdrop-blur-sm mb-16">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 inline-block text-transparent bg-clip-text">
              Stay Updated
            </h4>
            <p className="text-gray-300 mb-6">Join our newsletter and get the latest updates directly in your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="bg-white/10 rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm text-white placeholder-gray-400 min-w-[300px]"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 mb-4">
            &copy; {new Date().getFullYear()} Coddy.Dev. All rights reserved.
          </p>
          <div className="flex justify-center space-x-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <NavLink key={item}
                to={`/${item.toLowerCase().replace(' ', '')}`}
                className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                {item}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;