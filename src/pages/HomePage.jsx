import React, { useEffect, useState } from 'react';
import { useStore } from '../stores';
import { AuthStatuses, ProfileStatuses } from '../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';
import Home from '../components/Home';
import SellerLandingPage from './SellerLandingPage';

export default function HomePage() {
  const { appStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const allowedRoutes = [
    '/home/profile',
    '/home/dashboard',
    '/home/products',
    '/home/services',
  ];

  const isAllowedRoute = allowedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    const authState = appStore.authStatus;
    const profileState = appStore.profileStatus;

    if (isAllowedRoute) return;

    // Existing redirects
    if (authState === AuthStatuses.UNAUTHENTICATED) {
      navigate('/partner-landing-page');
    } else if (profileState === ProfileStatuses.UNVERIFIED) {
      navigate('/verify-email');
    } else if (profileState === ProfileStatuses.INCOMPLETE_PROFILE) {
      navigate('/onboarding');
    } else if (profileState === ProfileStatuses.UNDER_REVIEW) {
      navigate('/home/profile');
    }
  }, [appStore.authStatus, navigate, location.pathname]);

  return appStore.authStatus === AuthStatuses.LOGIN_SUCCESS ? (
    <Home />
  ) : (
    <SellerLandingPage />
  );
}
