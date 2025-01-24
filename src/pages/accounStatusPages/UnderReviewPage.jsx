import React from 'react';
import UnderVerificationLogo from '../../assets/applicationStatuses/underReview.png'
import LogoPrimary from '../../assets/logo-primary.png';
import { AuthStatuses } from '../../utils/constants';
import { useStore } from '../../stores';
import { useNavigate } from 'react-router-dom';

const UnderReviewPage = () => {

  const { appStore } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    appStore.setAppProperty('authStatus', AuthStatuses.UNAUTHENTICATED);
    appStore.updatePartnerInfo({});
    localStorage.removeItem("token");
    navigate('/')
  }

  return (
    <div className="bg-green-50 h-screen">
      <div className="px-12 py-5 h-[5%]">
        <img src={LogoPrimary} alt="" className="w-28" />
      </div>
      <div className="min-h-[90%] flex items-center justify-center">
        <div className="w-full max-w-2xl p-8 text-center">
          <img src={UnderVerificationLogo} alt="" className='mx-auto w-56'/>
          <h2 className="text-2xl font-semibold text-purple-500 mt-20">You Application Is Under Review. Please Login Later.</h2>
          <p className="text-lg text-gray-700 py-6">
            Thank you for submitting your application! Our team will
            review it and get back to you soon.
          </p>
          <button className='button-gradient1 px-20 text-white py-1 rounded-md mt-10' onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UnderReviewPage;
