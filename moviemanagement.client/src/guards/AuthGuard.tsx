import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/shared/Loading/LoadingScreen";

export function ProtectedRoute() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
}

export function RejectedRoute() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <Loader />;
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
