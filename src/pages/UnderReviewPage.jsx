import React from 'react';
import { FaHourglassHalf } from 'react-icons/fa';

const UnderReviewPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg text-center">
        <FaHourglassHalf className="mx-auto text-6xl text-blue-600 mb-6" />
        <h2 className="text-3xl font-semibold text-blue-600 mb-4">Application Under Review</h2>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for submitting your application! Our team will review it and get back to you soon.
        </p>
        <p className="text-sm text-gray-500">You will receive an email once your application has been approved.</p>
      </div>
    </div>
  );
};

export default UnderReviewPage;
