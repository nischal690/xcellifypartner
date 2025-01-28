import React, { useEffect } from 'react';

import LandingPage from '../components/landingPage/LandingPage';
import { useStore } from '../stores';
import { AuthStatuses } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const SellerLandingPage = () => {
  const {appStore} = useStore();
  const navigate = useNavigate();

  let isLoggedIn = false; 

  useEffect(() => {

    isLoggedIn = appStore.authStatus === AuthStatuses.LOGIN_SUCCESS;
    if(isLoggedIn) navigate('/home')
      
  },[appStore.authStatus])

  return !isLoggedIn ? <LandingPage /> : null;
};

export default SellerLandingPage;
