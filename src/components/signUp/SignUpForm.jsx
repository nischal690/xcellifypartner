import React, { useState } from 'react';

import TextInput from '../commonComponents/TextInput';
import TermsCheckbox from '../commonComponents/TermsCheckbox';
import PasswordStrengthChecker from './PasswordStrengthChecker';

import PasswordStrengthPopover from './PasswordStrengthPopover';

import { useSignUp } from '../../hooks/auth/useSignUp';
import Captcha from '../Captcha';

const SignUpForm = () => {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    isPasswordVisible,
    togglePasswordVisibility,
    isChecked,
    handleTermsClick,
    handlePrivacyClick,
    handleCheckboxChange,
    isButtonDisabled,
    loading,
    captchaValidation,
    updateRefreshCaptcha,
    refreshCaptcha,
    captchaValue,
    setCaptchaValue,
  } = useSignUp();

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-10">
        <TextInput
          type="text"
          name="firstName"
          placeholder="Enter your First name"
          value={formData.firstName}
          onChange={handleChange}
          containerStyle="flex items-center rounded-xl bg-[#F5F5F5] px-8 py-4 mb-7 w-full"
          inputStyle="w-full bg-transparent border-0 outline-none pl-2"
        />

        <TextInput
          type="text"
          name="lastName"
          placeholder="Enter your Last name"
          value={formData.lastName}
          onChange={handleChange}
          containerStyle="flex items-center rounded-xl bg-[#F5F5F5] px-8 py-4 mb-7 w-full"
          inputStyle="w-full bg-transparent border-0 outline-none pl-2"
        />

        <TextInput
          type="email"
          name="email"
          placeholder="Enter your Email address"
          value={formData.email}
          onChange={handleChange}
          containerStyle="flex items-center rounded-xl bg-[#F5F5F5] px-8 py-4 mb-7 w-full"
          inputStyle="w-full bg-transparent border-0 outline-none pl-2"
        />
        {errors.email && (
          <p className="pl-2 text-red-600 text-sm">{errors.email}</p>
        )}

        {/* Password Input with Eye Icon */}
        <PasswordStrengthPopover password={formData.password}>
          <TextInput
            type={isPasswordVisible.password ? 'text' : 'password'}
            name="password"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleChange}
            containerStyle="flex items-center rounded-xl bg-[#F5F5F5] px-8 py-4 mb-7 w-full"
            inputStyle="w-full bg-transparent border-0 outline-none pl-2"
          />
          <span
            className="absolute right-3 top-5 cursor-pointer text-gray-600"
            onClick={() => togglePasswordVisibility('password')}
          >
            {isPasswordVisible.password ? (
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
        </PasswordStrengthPopover>

        {/* Confirm Password Input with Eye Icon */}
        <div className="relative w-full">
          <TextInput
            type={isPasswordVisible.confirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Enter your Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            containerStyle="flex items-center rounded-xl bg-[#F5F5F5] px-8 py-4 mb-7 w-full"
            inputStyle="w-full bg-transparent border-0 outline-none pl-2"
          />
          <span
            className="absolute right-3 top-5 cursor-pointer text-gray-600"
            onClick={() => togglePasswordVisibility('confirmPassword')}
          >
            {isPasswordVisible.confirmPassword ? (
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
        {/* <PasswordStrengthChecker
          password={formData.password}
          confirmPassword={formData.confirmPassword}
        /> */}
        {errors.password && (
          <p className=" text-red-500 text-sm">{errors.password}</p>
        )}
        {errors.confirmPassword && (
          <p className=" text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
        <Captcha
          captchaValidation={captchaValidation}
          refreshCaptcha={refreshCaptcha}
          updateRefreshCaptcha={updateRefreshCaptcha}
          captchaValue={captchaValue}
          setCaptchaValue={setCaptchaValue}
        />
        <TermsCheckbox
          checked={isChecked}
          onChange={handleCheckboxChange}
          termsText="Terms of Use"
          privacyText="Privacy policy"
          onTermsClick={handleTermsClick}
          onPrivacyClick={handlePrivacyClick}
        />

        <button
          type="submit"
          className="w-full bg-purple-primary rounded-2xl text-white mt-5 py-2 disabled:bg-purple-disabled"
          disabled={isButtonDisabled}
        >
          {loading ? (
            <div role="status" className="flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-200 animate-spin fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
