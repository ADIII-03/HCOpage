import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="shadow sticky top-0 z-50 bg-white">
      <nav className="px-6 lg:px-8 py-3 border-b border-gray-200">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/11zon_cropped.png"
              className="mr-3 h-16 w-auto"
              alt="Logo"
            />
          </Link>

          {/* Hamburger Menu */}
          <button
            className="lg:hidden p-2 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Login & CTA */}
          <div className="flex items-center lg:order-2">
          <Link
  to="/Admin/Login"
  className="text-gray-800 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 focus:outline-none"
>
  Admin Login
</Link>

            <a
  href="https://forms.gle/L8PMpknuJmoMUbBs6"
  target="_blank"
  rel="noopener noreferrer"
  className="text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-4 py-2"
>
  Get started
</a>
          </div>

          {/* Navigation Links */}
          <div className={`${isMenuOpen ? "block" : "hidden"} lg:flex lg:w-auto lg:order-1`}>
            <ul className="flex flex-col lg:flex-row lg:space-x-8 font-medium mt-4 lg:mt-0">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Gallery", path: "/gallery" },
                { name: "Future Projects", path: "/FutureProjects" },
              ].map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded-lg transition duration-200 ${
                        isActive ? "text-orange-700 font-bold" : "text-gray-700 hover:text-orange-700"
                      }`
                    }
                    onClick={closeMenu}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
