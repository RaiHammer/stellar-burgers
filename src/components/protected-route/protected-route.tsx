import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  children: ReactNode;
  unAuth?: boolean;
}
export const ProtectedRoute = ({
  children,
  unAuth = false
}: ProtectedRouteProps) => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const isAuthenticated = !!user;
  const location = useLocation();
  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (unAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }
  if (!unAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return <>{children}</>;
};
