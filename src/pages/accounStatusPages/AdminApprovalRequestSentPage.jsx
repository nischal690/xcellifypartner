import React from 'react';

import { useNavigate } from 'react-router-dom';
import ApplicationSubmitted from '../../assets/applicationStatuses/applicationSubmitted.png'
import LogoPrimary from '../../assets/logo-primary.png';
import { AuthStatuses } from '../../utils/constants';
import { useStore } from '../../stores';

export default function AdminApprovalRequestSentPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-green-50 h-screen">
        <div className="px-12 py-5 h-[5%]">
          <img src={LogoPrimary} alt="" className="w-28" />
        </div>
      <div className="min-h-[90%] flex items-center justify-center">
        <div className="w-full max-w-2xl text-center">
          <img src={ApplicationSubmitted} alt="" className='mx-auto w-72' />
          <h2 className="text-3xl font-semibold text-purple-600 mb-4">
            Application Submitted Successfully!
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Your application has been successfully submitted. Our admin team will
            review it and get back to you soon.
          </p>
          <p className="text-sm text-gray-500">
            You will be notified via email once your application is approved.
          </p>
          <button
            className="mt-6 button-gradient1 text-white px-10 py-1 rounded-md"
            onClick={() => navigate('/home')}
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
