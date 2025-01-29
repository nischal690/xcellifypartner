import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

import SellerLandingPage from './pages/SellerLandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ComingSoonPage from './pages/ComingSoonPage';
import VerificationSentPage from './pages/accounStatusPages/VerificationSentPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import ResetPassword from './pages/ResetPassword';
import EmailVerificationPwd from './pages/EmailVerificationPwd';
import MultiStepVendorSignupPage from './pages/MultiStepVendorSignupPage';
import StepVendorProductDetailsPage from './pages/StepVendorProductDetailsPage';
import AdminApprovalRequestSentPage from './pages/accounStatusPages/AdminApprovalRequestSentPage';
import UnderReviewPage from './pages/accounStatusPages/UnderReviewPage';
import DashboardPage from './pages/DashboardPage';
import ProductDetail from './pages/ProductPage';
import AddNewProductPage from './pages/AddNewProductPage';
import LessonPreviewPage from './pages/LessonsPreviewPage';
import ProfilePage1 from './pages/ProfilePage1';
import { observer } from 'mobx-react';
import { useStore } from './stores';
import apiRequest from './utils/apiRequest';
import { AuthStatuses } from './utils/constants';
import { toJS } from 'mobx';
import AllProductsPage from './pages/AllProductsPage';
import AddNewProductPage1 from './pages/AddNewProductPage1';
import VerifyEmailPage from './pages/accounStatusPages/VerifyEmailPage';
import { validateAndSetAuthStatus } from './utils/validateAuth';
import NewProfilePage from './pages/NewProfilePage';
import { ToastContainer } from 'react-toastify';

import ProtectedRoute from './components/ProtectedRoute';
import Products from './pages/products/index';
import ProductDetailedView from './pages/productDetail/ProductDetailedView';

const router = createBrowserRouter([
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <SellerLandingPage />,
  },
  {
    path: '/home/*',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/partner-landing-page',
    element: <SellerLandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    //element: <ComingSoonPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
    //element: <ComingSoonPage />,
  },
  {
    path: '/onboarding',
    element: <MultiStepVendorSignupPage />,
  },
  {
    path: '/add-new-product',
    element: <StepVendorProductDetailsPage />,
  },
  {
    path: '/application-sent',
    element: <AdminApprovalRequestSentPage />,
  },
  {
    path: '/under-verification',
    element: <UnderReviewPage />,
  },
  {
    path: '/email-sent/:type',
    element: <VerificationSentPage />,
  },
  {
    path: '/email-verified',
    element: <EmailVerifiedPage />,
  },
  {
    path: '/changepassword-email',
    element: <EmailVerificationPwd />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/addNewProduct',
    element: <AddNewProductPage1 />,
  },
  {
    path: '/lessons/:id',
    element: <LessonPreviewPage />,
  },
  {
    path: '/ComingSoonPage',
    element: <ComingSoonPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const App = () => {
  const { appStore } = useStore();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeAuth = async () => {
      if (localStorage.getItem('token') !== '') {
        await validateAndSetAuthStatus(appStore);
      } else {
        appStore.setAppProperty('authStatus', AuthStatuses.UNAUTHENTICATED);
      }
      setLoading(false); // Only hide loading spinner after initialization
    };

    initializeAuth();
  }, [appStore]);

  return loading ? null : (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={1500}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        position="top-right"
      />
    </>
  );
  // Render nothing until loading is false
};

export default observer(App);
