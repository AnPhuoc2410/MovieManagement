import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTING_PATH } from "../../constants/endPoints";
import { useAuth } from "../../contexts/AuthContext";
import { getUserCookieToken } from "../../utils/auth.utils";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = ROUTING_PATH.AUTH,
}) => {
  const { isAuthenticated } = useAuth();
  const token = getUserCookieToken();

  if (!isAuthenticated && !token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
