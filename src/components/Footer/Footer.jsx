import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white border-t">
      <div className="mx-auto w-full max-w-screen-xl p-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <img src="/11zon_cropped.png" className="mr-3 h-16" alt="Logo" />
            </Link>
          </div>

          {/* Footer Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-6">
            {/* Resources */}
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">Resources</h2>
              <ul className="font-medium space-y-2">
                <li>
                  <Link to="/" className="hover:underline" onClick={() => window.scrollTo(0, 0)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:underline" onClick={() => window.scrollTo(0, 0)}>
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline" onClick={() => window.scrollTo(0, 0)}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">Follow Us</h2>
              <ul className="font-medium space-y-2">
                <li>
                  <a
                    href="https://www.instagram.com/humanity.club_organization/"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/humanity-club-organization/"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase">Legal</h2>
              <ul className="font-medium space-y-2">
                <li>
                  <Link to="#" className="hover:underline">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">Terms &amp; Conditions</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300 sm:mx-auto lg:my-8" />

        {/* Copyright and Social Icons */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm sm:text-center">
            © 2025{" "}
            <a href="/" className="hover:underline">
              HCO
            </a>
            . All Rights Reserved.
          </span>

          {/* Social Icons */}
          <div className="flex mt-4 sm:mt-0 space-x-6">
            <a
              href="https://www.instagram.com/humanity.club_organization/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/company/humanity-club-organization/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaFacebook size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
