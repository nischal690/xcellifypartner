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
    <div className="w-full min-h-screen flex flex-col max-md:items-center md:flex-row justify-center">
      {/* Login Left Container */}
      <div className="hidden md:flex flex-col justify-between w-1/2 h-screen lg:px-16 lg:py-16 md:px-10 md:py-12 bg-white">
        <div className="flex flex-col items-start justify-center h-full">
          <div className="mt-8 w-full flex flex-col items-center text-center">
            <h3 className="text-xl font-bold font-dmsans text-purple-primary mb-6">
              Why Partner with Us?
            </h3>

            <div className="w-full flex justify-center">
              <div className="space-y-6 w-full md:w-3/4 lg:w-2/3">
                {SignUpData.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center space-x-4 text-left w-full"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain"
                    />

                    <div className="flex-1">
                      <p className="text-m text-purple-primary">
                        <span className="font-bold text-purple-primary">
                          {item.title}:{' '}
                        </span>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>{' '}
          <img
            src={Icon}
            alt="Xcellify Logo"
            className="mt-8 w-40 h-30 mb-4 self-center"
          />
          {/* Last Image */}
        </div>
      </div>

      {/* Sign Right Container */}
      <div className="w-full min-h-screen md:w-1/2 flex flex-col items-center max-md:justify-center lg:pt-16 md:pt-12 md:px-4 bg-gradient-to-b from-purple-primary to-[#6C59CA]">
        <div className="w-full justify-center max-w-md">
          <h1 className="text-white text-4xl font-semibold mb-12">Sign Up</h1>

          <SignUpForm />

          <SeparatorWithText
            text="Or continue with"
            lineClass="h-px bg-gray-400"
            textClass="text-white px-4"
          />

          <div className="w-full flex items-center justify-center max-w-md mt-8 space-x-5">
            <SocialMediaButton
              icon={GoogleAuthIcon}
              text=""
              onClick={continueWithGoogle}
            />
            <SocialMediaButton
              icon={FacebookAuthIcon}
              text=""
              onClick={continueWithFacebook}
            />
          </div>

          <div className="text-center my-7">
            <p className="text-white">
              Already have an account?{' '}
              <Link to="/login" className="font-medium underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
}
