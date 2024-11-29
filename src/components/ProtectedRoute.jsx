import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const isSignedIn = useSelector((state) => state.user.isSignedIn);

  // if (loading) return <p>Loading...</p>

  return isSignedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

