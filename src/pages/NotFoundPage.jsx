// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaDribbble,
  FaSnapchat,
  FaDiscord,
  FaSnapchatGhost,
} from 'react-icons/fa';
import { FaLinkedinIn, FaSquareXTwitter, FaYoutube } from 'react-icons/fa6';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <h1 className="text-9xl font-extrabold text-purple-600"></h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        We are launching soon! Please stay updated.
      </h2>
      <Link
        to="/"
        className="mt-6 px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
      >
        Back to Homepage
      </Link>
      <footer className="mt-10 text-sm text-gray-500 text-center">
        © 2024 Xcellify™. All Rights Reserved.
      </footer>
      <div className="flex space-x-4 mt-6 text-gray-500">
        <a
          href="https://www.facebook.com/share/17tv5Rta4h/?mibextid=LQQJ4d"
          className="hover:text-purple-600"
        >
          <FaFacebookF className="w-6 h-6" />
        </a>
        <a
          href="https://www.instagram.com/xcellify_official/"
          className="hover:text-purple-600"
        >
          <FaInstagram className="w-6 h-6" />
        </a>
        <a href="https://www.x.com/xcellify" className="hover:text-purple-600">
          <FaSquareXTwitter className="w-6 h-6" />
        </a>
        <a
          href="https://www.linkedin.com/company/xcellify"
          className="hover:text-purple-600"
        >
          <FaLinkedinIn className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
