import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
// import Footer from './Footer';
import { NavLink } from "react-router-dom";
function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 min-h-full">
          <Outlet />
        </div>
        <div className="border-t border-gray-400 pt-4 text-center py-4">
          <p className="text-gray-600 my-4">
            &copy; {new Date().getFullYear()} Coddy.Dev. All rights reserved.
          </p>
          <div className="flex justify-center space-x-8">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <NavLink
                  key={item}
                  to={`/${item.toLowerCase().replace(" ", "")}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  {item}
                </NavLink>
              )
            )}
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
