import React, { useEffect, useState } from 'react';
import apiRequest from '../utils/apiRequest';

import PasswordStrengthPopover from '../components/signUp/PasswordStrengthPopover';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { validatePassword } from '../utils/HelperFunction';
import { HTTP_CODE } from '../utils/constants';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ message: '', color: '' });

  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const token = queryParameters.get('token');

  useEffect(() => {
    if (formData.newPassword != '' && formData.confirmPassword != '')
      if (validatePassword(formData.newPassword))
        setIsButtonEnabled(formData.newPassword == formData.confirmPassword);
  }, [formData]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  let handleSubmit = async () => {
    const data = {
      token: token,
      confirmPassword: formData.confirmPassword,
    };
    const response = await apiRequest({
      url: `/mic-login/reset-password`,
      method: 'post',
      data: data,
    });
    const status = response?.status || response?.response?.status;
    console.log(status);
    const info = status
      ? status === HTTP_CODE.SUCCESS
        ? { message: 'Password Updated Successfully', color: 'text-green-700' }
        : status === HTTP_CODE.TOKEN_INVALID
        ? { message: 'The reset link has expired', color: 'text-blue-500' }
        : {
            message: 'Internal server error, Please try again',
            color: 'text-red-700',
          }
      : {
          message: 'An error occured, Please try again',
          color: 'text-red-700',
        };
    setInfoMessage(info);
  };

  let handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center h-screen font-dmsans">
      <div className="flex flex-col p-5 bg-white rounded-lg shadow-md dark:border max-w-xl w-full sm:p-20">
        <h3 className="text-[#19074A] text-3xl font-bold ">Set new password</h3>
        {/* <p className='text-[#19074A] text-base p-1'>Enter a new password for userxyz@email.com</p> */}
        <div className="w-full flex justify-between items-center bg-[#E5E5E5] text-l px-2 font-normal outline-0 py-3 rounded-lg mt-4 sm:pl-7 sm:pr-5">
          <PasswordStrengthPopover password={formData.newPassword}>
            <div className="flex w-full items-center">
              <input
                className="w-11/12 border-0 outline-none bg-inherit"
                placeholder="New Password"
                type={isPasswordVisible ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <span
                className="text-gray-600 "
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </span>
            </div>
          </PasswordStrengthPopover>
        </div>
        <input
          className="bg-[#E5E5E5] text-l px-2 font-normal outline-0 py-3 rounded-lg mt-4 sm:px-7"
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button
          disabled={!isButtonEnabled}
          className="bg-purple-primary text-white text-l font-medium py-3 rounded-lg mt-4 disabled:bg-purple-disabled"
          onClick={handleSubmit}
        >
          Reset Password
        </button>
        {infoMessage.message != '' && (
          <p
            className={`text-center font-medium text-l mt-4 ${infoMessage.color}`}
          >
            {infoMessage.message}
          </p>
        )}
        <p className="text-center font-medium text-l mt-4">
          Back to login?
          <Link to="/login" className="text-purple-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
