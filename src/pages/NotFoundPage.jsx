// src/components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaGithub, FaDribbble } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <h1 className="text-9xl font-extrabold text-purple-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">Something's missing.</h2>
      <p className="mt-2 text-gray-600 text-center">
        Sorry, we can't find that page. You'll find lots to explore on the home page.
      </p>
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
        <a href="#" className="hover:text-purple-600">
          <FaFacebookF className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-purple-600">
          <FaInstagram className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-purple-600">
          <FaTwitter className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-purple-600">
          <FaGithub className="w-6 h-6" />
        </a>
        <a href="#" className="hover:text-purple-600">
          <FaDribbble className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
