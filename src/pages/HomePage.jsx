import React, { useEffect } from 'react';
import { useStore } from '../stores';
import { AuthStatuses, ProfileStatuses } from '../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';
import Home from '../components/Home';
import SellerLandingPage from './SellerLandingPage';

export default function HomePage() {
  const { appStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authState = appStore.authStatus;
    const profileState = appStore.profileStatus;

    //  If the user is NOT logged in, redirect to login
    if (authState === AuthStatuses.UNAUTHENTICATED) {
      navigate('/partner-landing-page');
      return;
    }

    // ✅ First-time onboarding only (auto-redirects ONCE)
    if (
      profileState === ProfileStatuses.INCOMPLETE_PROFILE &&
      location.pathname === '/home'
    ) {
      navigate('/onboarding');
      return;
    }

    // 🚀 Allow full access after login/signup (even if profile is incomplete)
  }, [
    appStore.authStatus,
    appStore.profileStatus,
    navigate,
    location.pathname,
  ]);

  return appStore.authStatus === AuthStatuses.LOGIN_SUCCESS ? (
    <Home />
  ) : (
    <SellerLandingPage />
  );
}
