import Login from '../components/login/Login';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../stores';
import { AuthStatuses } from '../utils/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const { appStore } = useStore();
  const isSignedIn = appStore.authStatus === AuthStatuses.LOGIN_SUCCESS;

  useEffect(() => {
    if (isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);

  return !isSignedIn ? <Login /> : null;
}
