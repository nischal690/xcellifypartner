import React, { useEffect, useState } from 'react';
import { useStore } from '../stores';
import { AuthStatuses, ProfileStatuses } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import Home from '../components/Home';
import SellerLandingPage from './SellerLandingPage';

export default function HomePage() {
  const { appStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Once auth status is updated, navigate accordingly
    const authState = appStore.authStatus;
    const profileState = appStore.profileStatus;

    if (authState === AuthStatuses.UNAUTHENTICATED) {
      navigate('/partner-landing-page');
    } else if (profileState === ProfileStatuses.UNVERIFIED) {
      navigate('/verify-email');
    } else if (profileState === ProfileStatuses.INCOMPLETE_PROFILE) {
      navigate('/onboarding');
    } else if (profileState === ProfileStatuses.UNDER_REVIEW) {
      navigate('/under-verification');
    } 
  }, [appStore.authStatus, navigate]);

  return appStore.authStatus === AuthStatuses.LOGIN_SUCCESS ? <Home /> : <SellerLandingPage />; // Only render HomePage if logged in
}
