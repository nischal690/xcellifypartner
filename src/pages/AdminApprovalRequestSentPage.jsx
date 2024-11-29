import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export default function AdminApprovalRequestSentPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg text-center">
        <FaCheckCircle className="mx-auto text-6xl text-green-600 mb-6" />
        <h2 className="text-3xl font-semibold text-green-600 mb-4">
          Application Submitted Successfully!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Your application has been successfully submitted. Our admin will review it and get back to you soon.
        </p>
        <p className="text-sm text-gray-500">
          You will be notified via email once your application is approved.
        </p>
      </div>
    </div>
  );
}
