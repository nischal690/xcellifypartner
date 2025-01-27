import axios from "axios";
import { HTTP_CODE } from "../utils/constants";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "../utils/localStorageService";
//import { useNavigate } from 'react-router-dom'

//const navigate = useNavigate()

const axiosInstance = axios.create({
  // baseURL: window.XcellifyURLConfig.api_domain_url || `https://xcellify.com/`,
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

/**
 * 
 * We can use this format to make any API calls :
 *   const response = await apiRequest({
      url: '/login',
      method: 'post/get/put/delete', etc...
      data : formData,
      params: query
    })
 */

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorageItem("token");
    console.log("Token:", token);

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    delete config.headers["Content-Type"];
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const { data } = response;
    const { errorCode, errorMessage, result } = data;
    if (errorCode) {
      return handleError({ response, message: errorMessage || result });
    } else {
      return response;
    }
  },
  (error) => {
    return handleError(error);
  }
);

const handleError = (error) => {
  let errorMessage = error?.message;
  const httpStaus = error?.response?.status || {};

  switch (httpStaus) {
    case HTTP_CODE.BAD_REQUEST:
      //show error message
      Promise.reject(error);
      break;
    case HTTP_CODE.TOKEN_INVALID:
      removeLocalStorageItem("token");
      //navigate('/login')
      break;
    case HTTP_CODE.FORBIDDEN:
      errorMessage =
        "You may not have permission for this page. Please contact your administrator."; // i18n
      break;
    default:
  }

  return { response: error?.response, errorMessage, message: errorMessage };
};

export default axiosInstance;
