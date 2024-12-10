import React, { useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  SeparatorWithText,
  SocialMediaButton,
} from "../../components/commonComponents";
import SignUpForm from "./SignUpForm";

import GoogleAuthIcon from "../../assets/loginPageAssets/authIcons/google-auth-icon.png";
import FacebookAuthIcon from "../../assets/loginPageAssets/authIcons/facebook-auth-icon.png";
import Icon from "../../assets/logo-primary.png";
import { SignUpData } from "./SignUpPageData";
import LoginLeftItems from "../login/LoginLeftItems";
import { useSignUp } from "../../hooks/auth/useSignUp";
import { useStore} from '../../stores'
import { AuthStatuses } from "../../utils/constants"

export default function SignUp() {
  const { continueWithGoogle, continueWithFacebook } = useSignUp();
  const navigate = useNavigate();
  const { appStore } = useStore();

	useEffect(() => {
		setTimeout(() => {
			if(appStore.authStatus === AuthStatuses.UNVERIFIED) {
				navigate("/onboarding")
			}
		}, 1000);
	}, [])

  return (
    <div className="w-full min-h-screen flex flex-col max-md:items-center md:flex-row justify-center">
      {/* Login Left Container */}
      <div className="hidden md:flex flex-col justify-between w-1/2 h-screen lg:px-16 lg:py-16 md:px-10 md:py-12 bg-white">
        <div className="w-full">
          <h1 className="text-purple-primary text-4xl font-bold mb-12">
            What’s the benefit of creating an account?
          </h1>
          <div className="flex flex-col items-center space-y-6 pt-14 w-full">
            {SignUpData.map((item, index) => (
              <LoginLeftItems
                key={index}
                img={item.img}
                content={item.content}
              />
            ))}
          </div>
          <div className="pt-10">
            <img
              src={Icon}
              alt="Xcellify Logo"
              onClick={()=>{navigate('/')}}
              className="md:w-[250px] lg:w-[300px] mx-auto cursor-pointer"
            />
          </div>
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
					<p className="text-white">Already have an account? <Link to="/login" className="font-medium underline">Login</Link></p>
				</div>
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
}
