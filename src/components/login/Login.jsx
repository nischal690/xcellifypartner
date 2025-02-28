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

      if (
        response?.status == HTTP_CODE.SUCCESS &&
        `${response?.data?.status_code}` === '112'
      ) {
        saveJwtInLocal(response.data.token);
        await validateAndSetAuthStatus(appStore);
        navigate('/home');
        toast.success('Login successful', { position: 'top-right' });
      } else {
        let statusCode = `${response.response.data.status_code}`;
        const errorMessage =
          statusCode === '111'
            ? 'User not registered'
            : statusCode === '113'
            ? 'Incorrect email or password'
            : 'Internal Server error';
        toast.error(errorMessage, { position: 'top-right' });
      }
    } catch (error) {
      console.error('Login error:', error);
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
      if (res && res.status == HTTP_CODE.SUCCESS && user_type_code === 1002) {
        if (res?.data?.role == 'student' || res?.data?.role == 'parent') {
          appStore.setAppProperty('authStatus', AuthStatuses.FORBIDDEN);
          toast.error('Access Denied', { position: 'top-right' });
          return;
        } else {
          saveJwtInLocal(res.data.token);
          appStore.setAppProperty('authStatus', AuthStatuses.LOGIN_SUCCESS);
          await validateAndSetAuthStatus(appStore);
          navigate('/');
        }
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
      if (res && res.status == HTTP_CODE.SUCCESS && user_type_code === 1002) {
        if (res?.data?.role == 'student' || res?.data?.role == 'parent') {
          appStore.setAppProperty('authStatus', AuthStatuses.FORBIDDEN);
          toast.error('Access Denied', { position: 'top-right' });
          return;
        } else {
          saveJwtInLocal(res.data.token);
          appStore.setAppProperty('authStatus', AuthStatuses.LOGIN_SUCCESS);
          await validateAndSetAuthStatus(appStore);
          navigate('/');
        }
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
      {/* Login Left Container */}
      <div className="hidden md:flex flex-col w-1/2 h-screen lg:px-16 lg:py-16 md:px-10 md:py-12 bg-white">
        <h3 className="text-4xl font-bold font-dmsans text-purple-primary mb-6">
          Why Partner with Us?
        </h3>
        <div className="w-full flex flex-col">
          <div className="w-full flex">
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
        <div className="flex flex-col items-start mt-8">
          <img
            src={Icon}
            alt="Xcellify Logo"
            className="w-44 h-32 mb-4 self-center"
          />
        </div>
      </div>

      {/* Login Right Container */}
      <div className="w-full min-h-screen md:w-1/2 flex flex-col items-center max-md:justify-center lg:pt-16 md:pt-12 md:px-4 bg-gradient-to-b from-purple-primary to-[#6C59CA]">
        <h1 className="text-white text-4xl font-semibold mb-12">Login</h1>
        <form className="w-full max-w-lg" onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center rounded-xl bg-[#F5F5F5] mb-7">
            <img src={emailIcon} alt="Email Icon" className=" py-4 px-8" />
            <input
              id="loginEmailInpt"
              className="w-full bg-transparent border-0 outline-none pl-2"
              placeholder="Enter your email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center rounded-xl bg-[#F5F5F5]">
            <img src={lockIcon} alt="Password Icon" className=" py-4 px-8" />
            <input
              className="w-full bg-transparent border-0 outline-none pl-2"
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
                className="w-8 h-6"
              />
            </span>
          </div>
          <div className="text-right mt-2 mb-5 mr-5">
            <p
              onClick={handleClick}
              className="text-white text-sm cursor-pointer"
            >
              Forgot password?
            </p>
          </div>
          <Captcha
            captchaValidation={captchaValidation}
            refreshCaptcha={refreshCaptcha}
            updateRefreshCaptcha={updateRefreshCaptcha}
            captchaValue={captchaValue}
            setCaptchaValue={setCaptchaValue}
          />
          <button
            disabled={!isButtonEnabled}
            className={`w-full text-white py-3 rounded-xl mt-10 transition-all ${
              isButtonEnabled
                ? 'bg-[#6A3CB3] hover:bg-[#57359E]'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            type="button"
            onClick={handleSubmit}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-200 animate-spin fill-white"
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
        <div className="flex items-center mt-8 w-full max-w-md">
          <span className="flex-1 h-px bg-gray-400"></span>
          <span className="text-white px-4">Or Continue With</span>
          <span className="flex-1 h-px bg-gray-400"></span>
        </div>
        <div className="w-full flex items-center justify-center max-w-md mt-8 space-x-5">
          <button
            className="w-10 h-10 flex items-center justify-center border-2 border-white py-2 px-2 rounded-full text-white transition-all bg-white "
            onClick={continueWithGoogle}
          >
            <img src={GoogleAuthIcon} alt="Google" className="w-full" />
          </button>
          {/*<button
            className="w-10 h-10 flex items-center justify-center border-2 border-white py-2 px-2 rounded-full text-white transition-all bg-white "
            onClick={continueWithFacebook}
          >
            <img src={FacebookAuthIcon} alt="Facebook" className="w-full" />
          </button>*/}
        </div>
        {/* <div className="w-full max-w-md mt-6 space-y-3">
					<button
						className="flex items-center justify-center w-full  py-2 rounded-xl transition-all bg-white text-[#6A3CB3] hover:bg-slate-100"
						onClick={continueWithGoogle}
					>
						<img src={GoogleAuthIcon} alt="Google" className="w-5 mr-2" />
						Continue with Google
					</button>
					<button
						className="flex items-center justify-center w-full py-2 rounded-xl transition-all bg-white text-[#6A3CB3] hover:bg-slate-100"
						onClick={continueWithFacebook}
					>
						<img src={FacebookAuthIcon} alt="Facebook" className="w-5 mr-2" />
						Continue with Facebook
					</button>
				</div> */}
        <div className="text-center mt-8">
          <p className="text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      <dialog
        className="items-center justify-center w-font-dmsans rounded-lg shadow-md"
        ref={emailDialog}
      >
        <EmailVerificationPwd closeDialog={closeDialog} />
      </dialog>
    </div>
  );
}
