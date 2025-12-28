import { NavLink } from "react-router-dom";
import { useScrollPosition } from "../hooks/useScrollPosition";
import { useAuth } from "../context/contexts-Files/authContext";
import { useState } from "react";

function Navbar() {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 0;
  const { signout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    try {
      signout();
      console.log("User signed out");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const navLinkStyle = ({ isActive }) =>
    `relative text-lg font-medium transition-all duration-300
     ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}
     after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 
     after:bg-blue-600 after:transition-all after:duration-300
     hover:after:w-full`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300
        ${isScrolled ? "shadow-md" : ""}`}
    >
      <div className="max-w-[85vw] mx-auto h-20 flex items-center justify-between px-4">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-bold text-gray-900 tracking-tight"
        >
          Coddy<span className="text-blue-600">.Dev</span>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <NavLink to="/about" className={navLinkStyle}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/pricing" className={navLinkStyle}>
              Pricing
            </NavLink>
          </li>
          <li>
            <NavLink to="/tools" className={navLinkStyle}>
              Tools
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className={navLinkStyle}>
              Profile
            </NavLink>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink
            to="/sign-in"
            className="px-4 py-2 rounded-md border bg-gray-600 text-white
                       hover:bg-gray-800 transition hover:cursor-pointer"
          >
            Sign In
          </NavLink>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-md bg-gray-600 text-white
                       hover:bg-gray-800 transition hover:cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white text-gray-700  text-bold border-t ">
          <ul className="flex flex-col items-center gap-4 py-6">
            <NavLink to="/about" onClick={() => setOpen(false)}>
              About Us
            </NavLink>
            <NavLink to="/pricing" onClick={() => setOpen(false)}>
              Pricing
            </NavLink>
            <NavLink to="/tools" onClick={() => setOpen(false)}>
              Tools
            </NavLink>
            <NavLink to="/profile" onClick={() => setOpen(false)}>
              Profile
            </NavLink>

            <button className="px-6 py-2 bg-gray-700 text-white rounded-md">
              <NavLink
                to="/sign-in"
               
              >Sign - in</NavLink>
            </button>
            <button
              onClick={handleSignOut}
              className="px-6 py-2 bg-gray-700 text-white rounded-md"
            >
              Sign Out
            </button>
          </ul>
        </div>
      )}
      <div className="max-w-[91vw] mx-auto h-1 rounded-xl bg-gray-500"></div>
    </nav>
  );
}

export default Navbar;
