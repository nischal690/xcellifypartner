// src/components/EmailVerified.js
import React from 'react';
import { Link } from 'react-router-dom';

const EmailVerifiedPage = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-purple-700 to-purple-600 text-white p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-white text-blue-900 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414 0L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Email Verified</h1>
        <p className="text-lg text-purple-200 mb-6">
          Thank you for verifying your email! You are now all set to use our services.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 mt-6 text-blue-900 bg-white rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
