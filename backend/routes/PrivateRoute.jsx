// backend/routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
