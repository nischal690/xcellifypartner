import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  SeparatorWithText,
  SocialMediaButton,
} from '../../components/commonComponents';
import SignUpForm from './SignUpForm';

import GoogleAuthIcon from '../../assets/loginPageAssets/authIcons/google-auth-icon.png';
import WhiteIcon from '../../assets/logo-white.png';

import FacebookAuthIcon from '../../assets/loginPageAssets/authIcons/facebook-auth-icon.png';
import Icon from '../../assets/logo-primary.png';
import signUplastImg from '../../assets/signUpPageAssets/Img/signUplastImg.png';
import { SignUpData } from './SignUpPageData';
import LoginLeftItems from '../login/LoginLeftItems';
import { useSignUp } from '../../hooks/auth/useSignUp';
import { useStore } from '../../stores';
import { AuthStatuses } from '../../utils/constants';

export default function SignUp() {
  const { continueWithGoogle, continueWithFacebook } = useSignUp();
  const navigate = useNavigate();
  const { appStore } = useStore();

  useEffect(() => {
    setTimeout(() => {
      if (appStore.authStatus === AuthStatuses.UNVERIFIED) {
        navigate('/onboarding');
      }
    }, 1000);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Left Container - Benefits Section */}
      <div className="hidden md:flex flex-col w-1/2 h-screen bg-white relative overflow-hidden">
        {/* Purple accent circles */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-primary/10"></div>
        <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full bg-purple-primary/5 transform translate-x-1/2"></div>
        
        {/* Content container with better spacing */}
        <div className="px-8 lg:px-16 py-16 flex flex-col h-full relative z-10">
          <h3 className="text-4xl font-bold font-dmsans text-purple-primary mb-8">
            Why Partner with Us?
          </h3>
          
          <div className="flex-grow space-y-8">
            {SignUpData.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-5 group transition-all duration-300 hover:translate-x-1"
              >
                <div className="w-14 h-14 rounded-xl bg-purple-primary/10 flex items-center justify-center shadow-sm">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-800">
                    <span className="font-bold text-purple-primary">
                      {item.title}:{' '}
                    </span>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Logo section at bottom */}
          <div className="mt-auto flex justify-center items-center pt-10">
            <img
              src={Icon}
              alt="Xcellify Logo"
              className="w-40 h-28 object-contain"
            />
          </div>
          
          {/* Bottom accent shape */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-primary/5 rounded-tl-full"></div>
        </div>
      </div>

      {/* Right Container - SignUp Form */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 bg-gradient-to-br from-purple-primary via-[#7249DB] to-[#6C59CA] relative overflow-hidden">
        {/* Design elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-tr-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-white/5"></div>
        
        {/* Content container */}
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="block md:hidden w-full mb-10">
            <img
              src={WhiteIcon}
              alt="Xcellify Logo"
              onClick={() => {
                navigate('/');
              }}
              className="w-20 cursor-pointer"
            />
          </div>
          
          {/* Sign up header with subtle animation */}
          <div className="text-center mb-8">
            <h1 className="text-white text-4xl font-bold mb-2">Create Account</h1>
            <p className="text-white/80 text-lg">Join our partner network today</p>
          </div>

          {/* SignUp form with improved styling */}
          <div className="backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/20 shadow-xl mb-6">
            <SignUpForm />
          </div>

          {/* Social login section with improved styling */}
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <span className="flex-1 h-px bg-white/20"></span>
              <span className="text-white/80 px-4">Or Sign Up With</span>
              <span className="flex-1 h-px bg-white/20"></span>
            </div>

            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                onClick={continueWithGoogle}
              >
                <img src={GoogleAuthIcon} alt="Google" className="w-6 h-6" />
              </button>
              <button
                className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                onClick={continueWithFacebook}
              >
                <img src={FacebookAuthIcon} alt="Facebook" className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Login link with improved styling */}
          <div className="text-center mt-8">
            <p className="text-white/80">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-white hover:underline transition-all">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
