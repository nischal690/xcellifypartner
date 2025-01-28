import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useLogin } from "react-facebook";

import { validateForm } from "../../utils/HelperFunction";
import apiRequest from "../../utils/apiRequest";
import { useStore } from "../../stores";
import { AuthStatuses, ProfileStatuses } from "../../utils/constants";

export const useSignUp = () => {
  let [loading, setLoading] = useState();
  const [isCaptchaVallid, setIsCaptchaValid] = useState(false);
  const [refreshCaptcha, setRefreshCaptcha] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("")
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();
  const selected_role = "partner" ;
  const { login } = useLogin();
  const { appStore } = useStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setIsButtonDisabled(!(allFieldsFilled && captchaValue!=''));
  }, [formData,captchaValue]);

  const togglePasswordVisibility = (field) => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleTermsClick = () => {
    console.log("Terms of Use clicked");
    // Navigate to Terms of Use page or open modal
  };

  const handlePrivacyClick = () => {
    console.log("Privacy Policy clicked");
    // Navigate to Privacy Policy page or open modal
  };

  const capitalizeFirstLetter = (text) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedValue =
      name === "firstName" || name === "lastName"
        ? capitalizeFirstLetter(value)
        : value;
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);
    const validationErrors = validateForm(formData);

    if (Object.values(validationErrors).some((error) => error !== "")) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    if (!isCaptchaVallid) {
      toast.error("Incorrect Captcha", { position: "top-right" });
      setRefreshCaptcha(true);
      setLoading(false);
      return;
    }

    if(!isChecked){
      toast.info("Please agree Terms of Use and Privacy policy", {position : "top-right"})
      setLoading(false)
      return;
    }
    try {
      // Uncomment the following lines to make an API request
      const response = await apiRequest({
        url: "/mic-login/signup",
        method: "post",
        data: { ...formData, provider: 0, role : selected_role },
      });
      const user_type_code = response?.data?.user_type_code || response?.response?.data?.user_type_code; 
      if (user_type_code == 1003) {
        //1001 : Signup creation success
        // saveJwtInLocal(response.data.token);
        appStore.setAppProperty('profileStatus', ProfileStatuses.UNVERIFIED);
        navigate("/email-sent/email-verification");
      } else if (user_type_code == 1002) {
        //1002 : already user exists with email-id
        setLoading(false);
        toast.error("User already exists in our system, Please Try Login", {
          position: "top-right",
        });
      } else {
        setLoading(false);
        toast.error("Internal Server error", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setLoading(false);
      toast.error("Sign-up failed. Please try again.", {
        position: "top-right",
      });
    }
  };

  let saveJwtInLocal = (jwt) => {
    localStorage.setItem("token", jwt);
  };

  let captchaValidation = (isValid) => {
    setIsCaptchaValid(isValid);
  };

  let updateRefreshCaptcha = () => {
    setRefreshCaptcha(false);
  };

  // Social Media Login

  let continueWithGoogle = useGoogleLogin({
    onSuccess: async (res) => {
      const data = {
        access_token: res.access_token,
        type: 1, //Google
        role : selected_role
      };
      const response = await apiRequest({
        url: "/mic-login/oauthsignup",
        method: "post",
        data,
      });
      
      const user_type_code = response?.data?.user_type_code || response?.response?.data?.user_type_code;
      if (user_type_code === 1001) {
        //1001 : Signup creation success
        saveJwtInLocal(response.data.token);
        appStore.setAppProperty('authStatus', AuthStatuses.LOGIN_SUCCESS)
        toast.success("Sign-Up successful!", { position: "top-right" });
        // navigate("/settings/profile");
        navigate("/onboarding")
      } else if (user_type_code === 1002) {
        //1002 : already user exists with email-id
        toast.error("User already exists in our system, Please Try Login", {
          position: "top-right",
        });
      } else {
        toast.error("Internal Server error", { position: "top-right" });
      }
    },
    onError: (error) => console.log(error),
  });

  let continueWithFacebook = async () => {
    try {
      const res = await login({
        scope: "email",
      });
      const data = {
        access_token: res.authResponse.accessToken,
        type: 2, //FaceBook
        role : selected_role
      };
      const response = await apiRequest({
        url: "/mic-login/oauthsignup",
        method: "post",
        data,
      });
      const user_type_code = response?.data?.user_type_code || response?.response?.data?.user_type_code;

      if (user_type_code === 1001) {
        //1001 : Signup creation success
        saveJwtInLocal(response.data.token);
        toast.success("Sign-up successful!", { position: "top-right" });
        navigate("/settings/profile");
        appStore.setAppProperty('authStatus', AuthStatuses.LOGIN_SUCCESS)
      } else if (user_type_code === 1002) {
        //1002 : already user exists with email-id
        toast.error("User already exists in our system, Please Try Login", {
          position: "top-right",
        });
      } else {
        toast.error("Internal Server error", { position: "top-right" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return {
    isPasswordVisible,
    togglePasswordVisibility,
    isChecked,
    setIsChecked,
    handleTermsClick,
    handlePrivacyClick,
    handleCheckboxChange,
    formData,
    errors,
    handleChange,
    handleSubmit,
    continueWithGoogle,
    continueWithFacebook,
    isButtonDisabled,
    loading,
    captchaValidation,
    updateRefreshCaptcha,
    refreshCaptcha,
    captchaValue,
    setCaptchaValue
  };
};
