import React, { useEffect, useState } from 'react';
import { useStore } from '../stores';
import { AuthStatuses, ProfileStatuses } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import Home from '../components/Home';

export default function HomePage() {
  const { appStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Once auth status is updated, navigate accordingly
    const authState = appStore.authStatus;
    const profileState = appStore.profileStatus;

    if (profileState === ProfileStatuses.UNVERIFIED) {
      navigate('/verify-email');
    } else if (profileState === ProfileStatuses.INCOMPLETE_PROFILE) {
      navigate('/onboarding');
    } else if (profileState === ProfileStatuses.UNDER_REVIEW) {
      navigate('/under-verification');
    } else if (authState === AuthStatuses.UNAUTHENTICATED) {
      navigate('/partner-landing-page');
    }
  }, [appStore.authStatus, navigate]);

  return appStore.authStatus === AuthStatuses.LOGIN_SUCCESS ? <Home /> : null; // Only render HomePage if logged in
}
