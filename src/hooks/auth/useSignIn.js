
import { useGoogleLogin } from '@react-oauth/google'
import { useLogin } from 'react-facebook'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const useSignIn = ()=>{
  const { login } = useLogin();
  const navigate = useNavigate();
  let [loading, setLoading] = useState();

  const continueWithGoogle = useGoogleLogin({
        onSuccess :async (response)=>{
          console.log(response.access_token? "access-token recieved" : "googleAPI error")
          const data = {
            "access_token" : response.access_token,
            "type" : 1 //Google
          }
          const res = await getJwt('http://localhost:3000/login',data)
          handleSocialLogin(res);  
        },
        onError : (error)=> console.log(error)
      })

  const continueWithFacebook = async ()=> { 
    try {
        const response = await login({
        scope: 'email',
        });
        console.log(response.authResponse.accessToken? "access-token recieved" : "facebookAPI error")
        const data = {
        "access_token" : response.authResponse.accessToken,
        "type" : 2 //FaceBook
        }
        const res = await getJwt('http://localhost:3000/login',data)
        handleSocialLogin(res);
    } catch (error) {
        console.log(error.message);
    }
  }

  const handleEmailLogin = (response)=>{
    if(!response){
      setLoading(false)
      console.log(response)
      toast.error("Internal Server error", { position: "top-right" });
      return;
    }
    if (response && response.status == 200 && `${response.data.status_code}` === '112') {
      saveJwtInLocal(response.data.token)
      sessionStorage.setItem('loginSuccess', 'true');
      setLoading(false)
      navigate('/');
    } else if (`${response.data.status_code}` === '111') {
      setLoading(false)
      toast.error("User not registered ", { position: "top-right" });
    } else if (`${response.data.status_code}` === '113') {
      setLoading(false)
      toast.error("Incorrect email or password ", { position: "top-right" });
    } 
  }

  const handleSocialLogin = (res)=>{
    if (res && res.status == 200 && res.data.user_type_code === 1002) {
      saveJwtInLocal(res.data.token)
      sessionStorage.setItem('loginSuccess', 'true');
      navigate('/');
    } else if (`${res && res.data.user_type_code}` === '1004') {
      toast.error("User is not registered with us", { position: "top-right" });
    } else {
      toast.error("Internal Server error", { position: "top-right" });
    }
  }

  const getJwt = async (url,data)=>{
    try{
      return await axios.post(url, data)
    }
    catch(error){
      console.log(error)
    } 
  }

  
  return {
    continueWithGoogle,
    continueWithFacebook,
    getJwt,
    handleSocialLogin,
    loading,
    setLoading,
    handleEmailLogin
  }
}




