import React from "react";
// import { NavLink } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
//       <div className="container mx-auto h-20 px-4 flex justify-between items-center">
//         <NavLink to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity">
//           Coddy.Dev
//         </NavLink>

//         <ul className="flex items-center gap-6">
//           <li>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 `px-3 py-2 rounded-lg transition-all duration-300 ${
//                   isActive
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
//                     : 'text-gray-300 hover:text-white'
//                 }`
//               }
//             >
//               About Us
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/pricing"
//               className={({ isActive }) =>
//                 `px-3 py-2 rounded-lg transition-all duration-300 ${
//                   isActive
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
//                     : 'text-gray-300 hover:text-white'
//                 }`
//               }
//             >
//               Pricing
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/tools"
//               className={({ isActive }) =>
//                 `px-3 py-2 rounded-lg transition-all duration-300 ${
//                   isActive
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
//                     : 'text-gray-300 hover:text-white'
//                 }`
//               }
//             >
//               Tools
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/profile"
//               className={({ isActive }) =>
//                 `px-3 py-2 rounded-lg transition-all duration-300 ${
//                   isActive
//                     ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
//                     : 'text-gray-300 hover:text-white'
//                 }`
//               }
//             >
//               Profile
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/signup"
//               className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-medium"
//             >
//               Sign Up
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }



import { NavLink } from "react-router-dom";
import { useScrollPosition } from "../hooks/useScrollPosition";

function Navbar() {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 0;

  return (
    <nav
      className={`transition-all duration-300 w-full z-50 
        ${
          isScrolled
            ? "fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-white/10 shadow-lg"
            : "  bg-black"
        }`}
    >
      <div className="container mx-auto h-20 px-4 flex justify-between items-center">
        {/* <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto h-20 px-4 flex justify-between items-center"> */}
        <NavLink
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
        >
          Coddy.Dev
        </NavLink>

        <ul className="flex items-center gap-6">
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-300 text-xl hover:text-white "
                }`
              }
            >
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-300 text-xl hover:text-white "
                }`
              }
            >
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tools"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-300 text-xl hover:text-white "
                }`
              }
            >
              Tools
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "text-gray-300 text-xl  hover:text-white "
                }`
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-medium"
            >
              Sign Up
            </NavLink>
          </li>
        </ul>
      </div>

      {/* </div> */}
      {/* <hr className="border-gray-900" /> */}
    </nav>
  );
}

export default Navbar;