import { NavLink } from "react-router-dom";
import { FiInstagram } from "react-icons/fi";
import { FiTwitter } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
function Footer() {
  return (
    <footer className=" box bg-white text-black pt-16 pb-4 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section with Logo and Description */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 inline-block text-transparent bg-clip-text mb-4">
            Coddy.Dev
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-xl">
            Empowering developers with cutting-edge AI solutions and tools to
            build the future of technology.
          </p>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {/* Quick Links */}
          <div className="bg-white border-2 border-gray-500 p-6 rounded-md shadow-xl h-80">
            <h4 className="text-xl font-bold text-blue-600 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-1 pt-4 ">
              {["About Us", "Pricing", "Tools", "Blog"].map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/${item.toLowerCase().replace(" ", "")}`}
                    className="text-gray-700 text-lg hover:text-blue-600 transition-all duration-300 flex items-center group"
                  >
                    <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                      → {item}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-white border-2 border-gray-500 p-6 rounded-md shadow-md">
            <h4 className="text-xl font-bold text-purple-600 mb-6">
              Resources
            </h4>
            <ul className="space-y-1 pt-4">
              {["Documentation", "API Reference", "Community", "Support"].map(
                (item) => (
                  <li key={item}>
                    <NavLink
                      to={`/${item.toLowerCase()}`}
                      className="text-gray-700 text-lg hover:text-purple-600 transition-all duration-300 flex items-center group"
                    >
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300">
                        → {item}
                      </span>
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-white border-2 border-gray-500 p-6 rounded-md shadow-md">
            <h4 className="text-xl font-bold text-green-600 mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4 pt-3">
              <li className="flex items-center space-x-3 group hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-100  flex items-center justify-center">
                  <MdMail className=" text-gray-600 text-md" />
                </div>
                <span className="text-gray-700 text-[16px] group-hover:text-green-600 transition-colors duration-300">
                  @coddy.dev
                </span>
              </li>
              <li className="flex items-center space-x-3 group hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FaPhone className=" text-gray-600 text-md" />
                </div>
                <span className="text-gray-700 text-[16px]  group-hover:text-green-600 transition-colors duration-300">
                  999999999
                </span>
              </li>
              <li className="flex items-center space-x-3 group hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <IoLocation className="text-gray-600" />
                </div>
                <span className="text-gray-700 text-[16px]  group-hover:text-green-600 transition-colors duration-300">
                  New York, USA
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="bg-white border-2 border-gray-500 p-6 rounded-md shadow-md flex flex-col items-start  py-4">
            <h4 className="text-xl font-bold text-pink-600 mb-3 mt-3">
              Connect With Us
            </h4>
            <div className="flex flex-col gap-3 w-full h-16 pt-5">
              {[
                {
                  icon: "twitter",
                  color: "bg-gray-600",
                  hover: "hover:bg-blue-600",
                  i: <FiTwitter />,
                  link: "https://twitter.com",
                },

                {
                  icon: "linkedin",
                  color: "bg-gray-600",
                  hover: "hover:bg-blue-700",
                  i: <FaLinkedin />,
                  link: "https://linkedin.com",
                },
                {
                  icon: "github",
                  color: "bg-gray-600",
                  hover: "hover:bg-blue-700",
                  i: <FaGithub />,
                  link: "https://github.com",
                },
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.color} ${social.hover} p-4 rounded-md flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg text-white`}
                >
                  {social.i} &nbsp; &nbsp;
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto bg-gray-200 rounded-2xl p-8 shadow-md mb-16">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 inline-block text-transparent bg-clip-text">
              Stay Updated
            </h4>
            <p className="text-gray-600 mb-6">
              Join our newsletter and get the latest updates directly in your
              inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 text-gray-800 placeholder-gray-500 min-w-[300px]"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        
        
      </div>
    </footer>
  );
}

export default Footer;
