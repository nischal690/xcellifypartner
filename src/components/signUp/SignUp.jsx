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
    <div className="w-full min-h-screen flex flex-col max-md:items-center md:flex-row justify-start overflow-y-auto">
      {/* Login Left Container */}
      <div className="hidden md:flex flex-col w-1/2 lg:px-16 lg:py-8 md:px-10 md:py-6 bg-white mt-9">
        <h3 className="text-4xl font-bold font-dmsans text-purple-primary mb-4">
          Why Partner with Us?
        </h3>
        <div className="w-full flex flex-col flex-1 mt-2">
          <div className="w-full flex">
            <div className="space-y-4 w-full md:w-3/4 lg:w-2/3">
              {SignUpData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center space-x-3 text-left w-full"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-contain"
                  />

                  <div className="flex-1 mt-4">
                    <p className="text-xl text-purple-primary">
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
        </div>
        {/* Fixing the gap between text and logo */}
        <div className="mb-4">
          <img src={Icon} alt="Xcellify Logo" className="w-48 h-36 mx-auto" />
        </div>
      </div>

      {/* Sign Right Container */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-start px-4 pt-8 bg-gradient-to-b from-purple-primary to-[#6C59CA]">
        <div className="w-full max-w-md">
          <h1 className="text-white text-4xl font-semibold mb-8">Sign Up</h1>

          <SignUpForm />

          <SeparatorWithText
            text="Or continue with"
            lineClass="h-px bg-gray-400"
            textClass="text-white px-4"
          />

          <div className="w-full flex items-center justify-center max-w-md mt-6 space-x-5">
            <SocialMediaButton
              icon={GoogleAuthIcon}
              text=""
              onClick={continueWithGoogle}
            />
            {/*<SocialMediaButton
              icon={FacebookAuthIcon}
              text=""
              onClick={continueWithFacebook}
            />*/}
          </div>

          <div className="text-center my-6">
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
