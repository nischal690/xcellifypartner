import { useStore } from "../../stores";
import {HTTP_CODE } from "../../utils/constants";
import React, { useEffect, useState } from "react";
import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LogoPrimary from '../../assets/logo-primary.png';
import { toast } from "react-toastify";
import apiRequest from '../../utils/apiRequest';
import Loading from "../../components/commonComponents/Loading";

const VerifyEmailPage = () => {

  const { appStore } = useStore();
  const navigate = useNavigate();
  const isVerified = appStore.isEmailVerified;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(isVerified) {
      navigate('/');
    }
  },[appStore.authStatus])

  const handleResendVerificationLink = async ()=>{
    if(loading)
      return;
    setLoading(true);
    const sendMailResp = await apiRequest({
      url: '/mic-login/sendVerifyMail',
      method: 'POST',
    })
    setLoading(false);
    if(sendMailResp?.status === HTTP_CODE.SUCCESS){
      toast.success('Email sent successfully. Please check your inbox');
    }
    else if(sendMailResp?.response?.status === HTTP_CODE.TOO_MANY_REQUESTS){
      toast.info('You have reached the limit, Please try again after 30 Minutes');
    }
    else{
      toast.error('Something went wrong, Please try again');
    }
  }

  return (
    <div className="bg-gray-50 h-screen">
      <div className="px-12 py-5 h-[5%]">
        <img src={LogoPrimary} alt="" className="w-28" />
      </div>
      <div className="flex items-center justify-center min-h-[90%]">
        <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 text-purple-primary rounded-full p-5 mb-6">
              <FiMail size={50} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-primary">
              Verify Your Email Address
            </h1>
            <p className="mt-4 text-blue-primary leading-6 sm:text-lg">
              A verification link has been sent to your registered email address. 
              Please check your inbox (and spam folder, just in case) and follow 
              the instructions to complete the verification process.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Didn't receive the email?</strong> Ensure the email address 
                you've provided is correct and try refreshing your inbox.
              </p>
            </div>

            <button
              onClick={handleResendVerificationLink}
              className="button-gradient1 mt-6 px-6 py-3 text-white font-medium rounded-lg shadow flex items-center gap-2 bg-purple-400"
            >
              {loading && <Loading color2='#ac94fa' color1='white'/>}
              Resend Verification Link
            </button>
          </div>

          <div className="mt-10 text-sm text-gray-500 text-center">
            <p>
              If you face any issues, feel free to reach out to our{" "}
              <a
                href="/contact"
                className="text-purple-800 hover:underline font-medium underline"
              >
                Support Team
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
