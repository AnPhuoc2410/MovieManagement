import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/shared/Loading/LoadingScreen";

export const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, userDetails } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if route requires admin and user is not admin
  if (requireAdmin && userDetails?.role !== 2) {
    // Redirect non-admin users to home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const RejectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={location.state?.from ?? "/"} replace />
  );
};
