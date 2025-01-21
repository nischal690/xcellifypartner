import React from "react";
import { FaUserCircle } from "react-icons/fa";
import PrimaryLogo from '../assets/logo-primary.png'

const OldNavbar = () => {
  return (
    <nav className="shadow-lg px-2 py-5">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
        <a href="https://vendor.xcellify.com/">
          <img src={PrimaryLogo} className="w-24 lg:w-32" alt="Xcellify" />
        </a>
        </div>

        {/* Nav Links */}
        <div className="flex items-center space-x-4">
          <a
            href="/dashboard"
            className="text-white px-3 py-2 rounded-md bg-blue-700"
          >
            Dashboard
          </a>
          <a
            href="/logout"
            className="text-white px-3 py-2 rounded-md bg-blue-700"
          >
            Logout
          </a>
          <FaUserCircle size={24} className="text-white" />
        </div>
      </div>
    </nav>
  );
};

export default OldNavbar;
