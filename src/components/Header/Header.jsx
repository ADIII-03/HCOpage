import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const scrollToDonation = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollToDonation: true } });
    } else {
      const donationSection = document.getElementById('donation-section');
      if (donationSection) {
        donationSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    closeMenu();
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-200">
        <nav className="px-4 py-3">
          <div className="flex items-center justify-between mx-auto max-w-7xl">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/11zon_cropped.png" className="h-12 w-auto" alt="Logo" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Gallery", path: "/gallery" },
                { name: "Future Projects", path: "/FutureProjects" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-base font-medium ${
                      isActive ? "text-orange-700" : "text-gray-700 hover:text-orange-600"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              <button
                onClick={scrollToDonation}
                className="text-orange-600 hover:text-orange-700 font-medium text-base"
              >
                Support Our Cause
              </button>
            </div>

            {/* Desktop Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <button
                  onClick={logout}
                  className="text-gray-800 hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/admin"
                  className="text-gray-800 hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Admin Login
                </Link>
              )}
              <a
                href="https://forms.gle/L8PMpknuJmoMUbBs6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-4 py-2"
              >
                Get started
              </a>

              {/* Hamburger Menu Button - Only visible on mobile */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[72px] bg-white z-40 shadow-lg">
            <div className="flex flex-col items-center pt-4 pb-20 overflow-y-auto h-full bg-white">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Gallery", path: "/gallery" },
                { name: "Future Projects", path: "/FutureProjects" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full text-center py-4 text-lg ${
                      isActive ? "text-orange-700 font-bold" : "text-gray-700"
                    }`
                  }
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              ))}
              <button
                onClick={scrollToDonation}
                className="w-full py-4 text-lg text-orange-600 hover:text-orange-700 font-medium"
              >
                Support Our Cause
              </button>
            </div>
          </div>
        )}
      </header>
      {/* Spacer div to prevent content from being hidden under fixed header */}
      <div className="h-[72px]"></div>
    </>
  );
}

export default Header;
