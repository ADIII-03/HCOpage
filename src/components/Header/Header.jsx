import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideTimeout, setHideTimeout] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Clear any existing timeout
      if (hideTimeout) clearTimeout(hideTimeout);
      
      // Show header when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide header when scrolling down and not at top
        setIsVisible(false);
      }
      
      // Set timeout to hide header after 1 second of no scrolling
      const timeout = setTimeout(() => {
        if (currentScrollY > 100) {
          setIsVisible(false);
        }
      }, 1000);
      
      setHideTimeout(timeout);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [lastScrollY, hideTimeout]);

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
      <header className={`fixed top-0 w-full z-50 transition-transform duration-300 bg-white border-b border-gray-200 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <nav className="px-4 lg:px-8 py-2">
          <div className="flex items-center justify-between mx-auto max-w-screen-xl">
            {/* Logo */}
            <Link to="/" className="flex items-center py-2">
              <img src="/11zon_cropped.png" className="h-12 w-auto" alt="Logo" />
            </Link>

            {/* Desktop Buttons */}
            <div className="flex items-center space-x-2">
              {/* Always visible buttons */}
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

              {/* Hamburger Menu Button */}
              <button
                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
          <div className="fixed inset-0 top-[60px] bg-white z-40">
            <div className="flex flex-col items-center pt-4 pb-20 overflow-y-auto">
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
      <div className="h-[60px]"></div>
    </>
  );
}

export default Header;
