import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { useEffect, useState, lazy } from 'react';
import { observer } from 'mobx-react';
import { useStore } from './stores';
import apiRequest from './utils/apiRequest';
import { AuthStatuses } from './utils/constants';
import { toJS } from 'mobx';
import { validateAndSetAuthStatus } from './utils/validateAuth';
import { ToastContainer } from 'react-toastify';

const SellerLandingPage = lazy(() => import('./pages/SellerLandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ComingSoonPage = lazy(() => import('./pages/ComingSoonPage'));
const VerificationSentPage = lazy(() =>
  import('./pages/accounStatusPages/VerificationSentPage')
);
const EmailVerifiedPage = lazy(() => import('./pages/EmailVerifiedPage'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const EmailVerificationPwd = lazy(() => import('./pages/EmailVerificationPwd'));
const MultiStepVendorSignupPage = lazy(() =>
  import('./pages/MultiStepVendorSignupPage')
);
const StepVendorProductDetailsPage = lazy(() =>
  import('./pages/StepVendorProductDetailsPage')
);
const AdminApprovalRequestSentPage = lazy(() =>
  import('./pages/accounStatusPages/AdminApprovalRequestSentPage')
);
const UnderReviewPage = lazy(() =>
  import('./pages/accounStatusPages/UnderReviewPage')
);
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProductDetail = lazy(() => import('./pages/ProductPage'));
const AddNewProductPage = lazy(() => import('./pages/AddNewProductPage'));
const LessonPreviewPage = lazy(() => import('./pages/LessonsPreviewPage'));
const PrivacyPolicyScreen = lazy(() =>
  import('./components/landingPage/footerPages/PrivacyPolicyScreen')
);
const TermsOfUseScreen = lazy(() =>
  import('./components/landingPage/footerPages/TermsOfUseScreen')
);
const ProfilePage1 = lazy(() => import('./pages/ProfilePage1'));
const AllProductsPage = lazy(() => import('./pages/AllProductsPage'));
const AddNewProductPage1 = lazy(() => import('./pages/AddNewProductPage1'));
const VerifyEmailPage = lazy(() =>
  import('./pages/accounStatusPages/VerifyEmailPage')
);
const NewProfilePage = lazy(() => import('./pages/NewProfilePage'));
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/commonComponents/ErrorBoundary';
import StepVendorCreateProducts from './pages/StepVendorCreateProducts';

const Products = lazy(() => import('./pages/products/index'));
const ProductDetailedView = lazy(() =>
  import('./pages/productDetail/ProductDetailedView')
);
const ProductEdit = lazy(() => import('./pages/productEdit/index'));
const ContactUs = lazy(() => import('./pages/ContactusPage'));
const AboutusPage = lazy(() => import('./pages/AboutusPage'));

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
    element: (
      <ProtectedRoute>
        <ErrorBoundary
          showErrorDetails={process.env.NODE_ENV === 'development'}
        >
          <MultiStepVendorSignupPage />
        </ErrorBoundary>
      </ProtectedRoute>
    ),
  },
  {
    path: '/add-new-product-1',
    element: <StepVendorProductDetailsPage />,
  },
  {
    path: '/add-new-product',
    element: <StepVendorCreateProducts />,
  },
  {
    path: '/edit-product/:category/:subcategory',
    element: <ProductEdit />,
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
    path: '/PrivacyPolicy',
    element: <PrivacyPolicyScreen />,
  },
  { path: '/TermsOfUse', element: <TermsOfUseScreen /> },
  {
    path: '/ComingSoonPage',
    element: <ComingSoonPage />,
  },
  {
    path: '/about-us',
    element: <AboutusPage />,
  },
  {
    path: '/contact',
    element: <ContactUs />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const App = () => {
  const { appStore } = useStore();
  const [loading, setLoading] = useState(true); // Add loading state

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkIfMobileDevice = () => {
      const hasTouch = navigator.maxTouchPoints > 1;
      const screenWidth = window.screen.width < 768;

      setIsMobileDevice(hasTouch && screenWidth);
    };

    checkIfMobileDevice();
  }, []);

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

  // if (isMobileDevice) {
  //   return <ComingSoonPage />;
  // }

  return loading ? null : (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={5000}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        position="top-right"
      />
    </>
  );
  // Render nothing until loading is false
};

export default observer(App);
