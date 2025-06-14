import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '@/UserContext';
import LoadingSpinner from '@/components/ui/loading-spinner';

const ProtectedRoute = ({ children }) => {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute; 