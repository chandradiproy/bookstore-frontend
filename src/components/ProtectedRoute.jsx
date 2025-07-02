// A component to protect routes that require authentication.

import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectCurrentToken } from '../redux/features/auth/authSlice';

export default function ProtectedRoute({ children }) {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
