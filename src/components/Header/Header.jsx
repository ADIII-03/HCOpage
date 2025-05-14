import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white'}`}>
      <nav className="px-4 lg:px-8 py-2">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center py-2">
            <img src="/11zon_cropped.png" className="h-12 w-auto" alt="Logo" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Navigation Links - Mobile */}
          <div className={`${isMenuOpen ? "flex" : "hidden"} lg:hidden fixed inset-0 top-[64px] bg-white/95 backdrop-blur-sm z-40`}>
            <div className="w-full h-full flex flex-col items-center pt-4 pb-20 overflow-y-auto">
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
              <div className="mt-4 flex flex-col gap-3 w-full px-4">
                <button
                  onClick={scrollToDonation}
                  className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium text-base"
                >
                  Support Our Cause
                </button>
                {user ? (
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="w-full py-3 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-base"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/admin"
                    className="w-full py-3 text-center text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-base"
                    onClick={closeMenu}
                  >
                    Admin Login
                  </Link>
                )}
                <a
                  href="https://forms.gle/L8PMpknuJmoMUbBs6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-center text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium text-base"
                  onClick={closeMenu}
                >
                  Get started
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
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
                  `py-2 px-3 rounded-lg transition duration-200 ${
                    isActive ? "text-orange-700 font-bold" : "text-gray-700 hover:text-orange-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <button
              onClick={scrollToDonation}
              className="text-white bg-orange-600 hover:bg-orange-700 font-medium rounded-lg text-sm px-4 py-2 transition-colors duration-300"
            >
              Support Our Cause
            </button>
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
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
