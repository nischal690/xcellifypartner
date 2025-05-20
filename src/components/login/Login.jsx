import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { data } from './loginPageData';
import 'react-toastify/dist/ReactToastify.css';
import apiRequest from '../../utils/apiRequest';
import LoginLeftItems from './LoginLeftItems';
import Icon from '../../assets/logo-primary.png';
import signUplastImg from '../../assets/signUpPageAssets/Img/signUplastImg.png';

import { SignUpData } from '../../components/signUp/SignUpPageData';
import GoogleAuthIcon from '../../assets/loginPageAssets/authIcons/google-auth-icon.png';
import WhiteIcon from '../../assets/logo-white.png';

import FacebookAuthIcon from '../../assets/loginPageAssets/authIcons/facebook-auth-icon.png';
import { useLogin } from 'react-facebook';
import Captcha from '../Captcha';

import emailIcon from '../../assets/loginPageAssets/emailIcon.svg';
import lockIcon from '../../assets/loginPageAssets/lockIcon.svg';
import eyeOn from '../../assets/loginPageAssets/eyeOn.png';
import eyeOff from '../../assets/loginPageAssets/eyeOff.png';
import EmailVerificationPwd from '../../pages/EmailVerificationPwd';
import { useStore } from '../../stores';
import { AuthStatuses, HTTP_CODE } from '../../utils/constants';
import { validateAndSetAuthStatus } from '../../utils/validateAuth';

export default function Login() {
  const { appStore } = useStore();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [captchaValue, setCaptchaValue] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [loading, setLoading] = useState();
  const [isCaptchaVallid, setIsCaptchaValid] = useState(false);
  const [refreshCaptcha, setRefreshCaptcha] = useState(false);
  const emailDialog = useRef();

  const navigate = useNavigate();
  const { login } = useLogin();

  useEffect(() => {
    setTimeout(() => {
      if (appStore.authStatus === AuthStatuses.LOGIN_SUCCESS) {
        navigate('/');
      }
    }, 1000);
  }, []);

  useEffect(() => {
    setIsButtonEnabled(
      formData.email !== '' && formData.password !== '' && captchaValue !== ''
    );
  }, [formData, captchaValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (!isCaptchaVallid) {
      toast.error('Incorrect Captcha', { position: 'top-right' });
      setRefreshCaptcha(true);
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest({
        url: '/mic-login/login',
        method: 'post',
        data: { ...formData, role: 'partner' },
      });
      console.log('Login response:', response);

      // ✅ Handle forbidden roles
      if (
        response?.response?.data?.role === 'parent' ||
        response?.response?.data?.role === 'student'
      ) {
        toast.warn(
          "You are registered as 'Customer' with us. Please use another email to access the Partner Portal.",
          { position: 'top-right' }
        );
        setLoading(false);
        return;
      }
      if (response?.response?.data?.role === 'admin') {
        toast.info('This account is linked to the admin portal', {
          position: 'top-right',
        });
        setLoading(false);
        return;
      }

      //  Handle successful login correctly
      if (
        response?.data?.success === true &&
        response?.data?.status_code === 112
      ) {
        saveJwtInLocal(response.data.token);
        await validateAndSetAuthStatus(appStore);
        navigate('/home');
        toast.success('Login successful', { position: 'top-right' });
        return;
      }

      //  Handle other API errors properly
      let statusCode = `${response?.data?.status_code}`;
      const errorMessage =
        statusCode === '111'
          ? 'User not registered'
          : statusCode === '113'
          ? 'Incorrect email or password'
          : response?.data?.message || 'Internal Server error';
      toast.error(errorMessage, { position: 'top-right' });
    } catch (error) {
      console.error('Login error:', error?.response?.data || error);
      toast.error('An error occurred. Please try again.', {
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  let continueWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      const data = {
        access_token: response.access_token,
        type: 1, //Google
      };
      const res = await apiRequest({
        url: '/mic-login/oauthlogin',
        method: 'post',
        data: { ...data, role: 'partner' },
      });
      const user_type_code =
        res?.data?.user_type_code || res?.response?.data?.user_type_code;

      if (
        res?.response?.data?.role === 'parent' ||
        res?.response?.data?.role === 'student'
      ) {
        toast.warn(
          "You are registered as 'Customer' with us. Please use another email to access the Partner Portal.",
          { position: 'top-right' }
        );
        setLoading(false);
        return;
      }
      if (res?.response?.data?.role === 'admin') {
        toast.info('This account is linked to the admin portal', {
          position: 'top-right',
        });
        setLoading(false);
        return;
      }

      if (res && res.status == HTTP_CODE.SUCCESS && user_type_code === 1002) {
        saveJwtInLocal(res.data.token);
        appStore.setAppProperty('authStatus', AuthStatuses.LOGIN_SUCCESS);
        await validateAndSetAuthStatus(appStore);
        navigate('/');
      } else {
        const errorMessage =
          `${user_type_code}` === '1004'
            ? 'User is not registered with us'
            : 'Internal Server error';
        toast.error(errorMessage, { position: 'top-right' });
      }
    },
    onError: (error) => console.log(error),
  });

  let continueWithFacebook = async () => {
    try {
      const response = await login({
        scope: 'email',
      });
      console.log(response);
      const data = {
        access_token: response.authResponse.accessToken,
        type: 2, //FaceBook
      };
      const res = await apiRequest({
        url: '/mic-login/oauthlogin',
        method: 'post',
        data: { ...data, role: 'partner' },
      });
      const user_type_code =
        res?.data?.user_type_code || res?.response?.data?.user_type_code;

      if (
        res?.response?.data?.role === 'parent' ||
        res?.response?.data?.role === 'student'
      ) {
        toast.warn(
          "You are registered as 'Customer' with us. Please use another email to access the Partner Portal.",
          { position: 'top-right' }
        );
        setLoading(false);
        return;
      }
      if (res?.response?.data?.role === 'admin') {
        toast.info('This account is linked to the admin portal', {
          position: 'top-right',
        });
        setLoading(false);
        return;
      }

      if (res && res.status == HTTP_CODE.SUCCESS && user_type_code === 1002) {
        saveJwtInLocal(res.data.token);
        appStore.setAppProperty('authStatus', AuthStatuses.LOGIN_SUCCESS);
        await validateAndSetAuthStatus(appStore);
        navigate('/');
      } else {
        const errorMessage =
          `${user_type_code}` === '1004'
            ? 'User is not registered with us'
            : 'Internal Server error';
        toast.error(errorMessage, { position: 'top-right' });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  let saveJwtInLocal = (jwt) => {
    localStorage.setItem('token', jwt);
  };

  let captchaValidation = (isValid) => {
    setIsCaptchaValid(isValid);
  };

  let updateRefreshCaptcha = () => {
    setRefreshCaptcha(false);
  };

  let handleClick = () => {
    emailDialog.current.showModal();
  };

  let closeDialog = () => {
    emailDialog.current.close();
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Left Container - Benefits Section */}
      <div className="hidden md:flex flex-col w-1/2 h-screen bg-white relative overflow-hidden">
        {/* Purple accent circle */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-primary/10"></div>
        
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

      {/* Right Container - Login Form */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 bg-gradient-to-br from-purple-primary via-[#7249DB] to-[#6C59CA] relative overflow-hidden">
        {/* Design elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-tr-full"></div>
        
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
          
          {/* Login header with subtle animation */}
          <div className="text-center mb-10">
            <h1 className="text-white text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-white/80 text-lg">Login to your account</p>
          </div>

          {/* Login form with improved styling */}
          <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email input */}
            <div className="relative group">
              <div className="flex items-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:border-white/30 focus-within:border-white/40">
                <img src={emailIcon} alt="Email Icon" className="py-4 px-5" />
                <input
                  id="loginEmailInpt"
                  className="w-full bg-transparent border-0 outline-none pl-2 pr-5 py-4 text-white placeholder-white/60"
                  placeholder="Enter your email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="relative group">
              <div className="flex items-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:border-white/30 focus-within:border-white/40">
                <img src={lockIcon} alt="Password Icon" className="py-4 px-5" />
                <input
                  className="w-full bg-transparent border-0 outline-none pl-2 pr-5 py-4 text-white placeholder-white/60"
                  placeholder="Enter your password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="cursor-pointer pe-4"
                >
                  <img
                    src={isPasswordVisible ? eyeOn : eyeOff}
                    alt="Toggle Visibility"
                    className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity"
                  />
                </span>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <p
                onClick={handleClick}
                className="text-white/80 text-sm cursor-pointer hover:text-white hover:underline transition-all"
              >
                Forgot password?
              </p>
            </div>

            {/* Captcha component */}
            <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/20">
              <Captcha
                captchaValidation={captchaValidation}
                refreshCaptcha={refreshCaptcha}
                updateRefreshCaptcha={updateRefreshCaptcha}
                captchaValue={captchaValue}
                setCaptchaValue={setCaptchaValue}
              />
            </div>

            {/* Login button with improved styling */}
            <button
              disabled={!isButtonEnabled}
              className={`w-full py-4 rounded-xl mt-4 font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                isButtonEnabled
                  ? 'bg-white text-purple-primary hover:shadow-purple-500/20'
                  : 'bg-white/50 text-purple-800/50 cursor-not-allowed'
              }`}
              type="button"
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-purple-300 animate-spin fill-purple-600"
                    viewBox="0 0 100 101"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591..."
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539..."
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          {/* Social login section */}
          <div className="mt-8">
            <div className="flex items-center">
              <span className="flex-1 h-px bg-white/20"></span>
              <span className="text-white/80 px-4">Or Continue With</span>
              <span className="flex-1 h-px bg-white/20"></span>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
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

          {/* Sign up link */}
          <div className="text-center mt-10">
            <p className="text-white/80">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-white hover:underline transition-all">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Password reset dialog */}
      <dialog
        className="rounded-2xl shadow-xl bg-white p-6 max-w-md w-full"
        ref={emailDialog}
      >
        <EmailVerificationPwd closeDialog={closeDialog} />
      </dialog>
    </div>
  );
}
