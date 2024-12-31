import React, { useEffect, useState } from 'react';
import { useStore } from '../stores';
import { AuthStatuses } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import Home from '../components/Home';

export default function HomePage() {
  const { appStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Once auth status is updated, navigate accordingly
    const authState = appStore.authStatus;
    console.log(appStore.authStatus);

    if (authState === AuthStatuses.UNVERIFIED) {
      navigate('/verify-email');
    } else if (authState === AuthStatuses.INCOMPLETE_PROFILE) {
      navigate('/onboarding');
    } else if (authState === AuthStatuses.UNDER_REVIEW) {
      navigate('/under-verification');
    } else if (authState === AuthStatuses.UNAUTHENTICATED) {
      navigate('/partner-landing-page');
    }
  }, [appStore.authStatus, navigate]);

  return appStore.authStatus === AuthStatuses.LOGIN_SUCCESS ? <Home /> : null; // Only render HomePage if logged in
}
