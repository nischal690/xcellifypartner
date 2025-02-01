import React, { useRef, useState } from 'react';
import apiRequest from '../utils/apiRequest';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/HelperFunction';
import { toast } from 'react-toastify';
import { HTTP_CODE } from '../utils/constants';

export default function EmailVerificationPwd({ closeDialog }) {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  let handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
  };

  let handleSubmit = async () => {
    if (email == '') return;
    const response = await apiRequest({
      url: '/mic-login/send-reset-link',
      method: 'post',
      data: { email },
    });
    console.log({ email });
    if (response?.status === HTTP_CODE.SUCCESS) {
      navigate('/email-sent/reset-pwd');
    } else {
      toast.error('An error occured, Please try again', {
        position: 'top-right',
      });
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white rounded-lg shadow-md dark:border max-w-xl w-full sm:p-20">
      <h3 className="text-[#212121] text-3xl font-bold ">Forgot password</h3>
      <p className="text-[#848484] text-base p-1">
        Enter your email to receive a password reset link
      </p>
      <input
        className="bg-[#E5E5E5] text-l px-2 font-normal outline-0 py-3 rounded-lg mt-4 sm:px-7"
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <button
        className="bg-purple-primary text-white text-l font-medium py-3 rounded-lg mt-4"
        onClick={handleSubmit}
      >
        Send request link
      </button>
      <div className="flex justify-center mt-4">
        <p className="font-medium text-l items-center me-1">Back to login?</p>
        <p
          onClick={closeDialog}
          className="items-center text-purple-primary cursor-pointer"
        >
          Login
        </p>
      </div>
    </div>
  );
}
