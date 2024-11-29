import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import InboxImg from '../assets/inbox.png'
import { useSelector } from 'react-redux';

const VerificationSentPage = () => {

  const navigate = useNavigate();
  const {type} = useParams();
//   const isSignedIn = useSelector((state) => state.user.isSignedIn); 
  
//   useEffect(() => {
//     isSignedIn ? navigate('/') : null;
//   },[])
  const data = {};
  switch(type){
    case "reset-pwd"          : data.heading = "Check your email";
                                data.para = "A password reset link has been sent to your email. Please check your inbox and click on the link to reset your password."
                                break;
    case "email-verification" : data.heading = "Check your email";
                                data.para = "A verification link has been sent to your email. Please check your inbox and click on the link to verify your account."
                                break;
    default : navigate('/')
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 via-purple-700 to-blue-900 text-white p-6">
      <div className="max-w-xl w-full text-center">
        <img src={InboxImg} alt="Logo" className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{data.heading}</h1>
        <p className="mb-6 text-md md:text-lg text-purple-200">
          {data.para}
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 mt-6 text-blue-900 bg-white rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default VerificationSentPage;
