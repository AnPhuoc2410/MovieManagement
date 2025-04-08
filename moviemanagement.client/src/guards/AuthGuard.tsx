import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Role } from "../types/roles.type";

interface Props {
  allowedRoles?: Role[]; // Array of allowed roles
  children?: React.ReactNode; // Child components to render
  redirectPath?: string; // Customizable redirect path
}

export const ProtectedRoute: React.FC<Props> = ({
  allowedRoles = [Role.Member, Role.Employee, Role.Admin], // Default to all roles
  children,
  redirectPath = "/",
}) => {
  const { isAuthenticated, userDetails } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user's role is in the allowed roles
  const hasAccess = userDetails?.role !== undefined ? allowedRoles.includes(userDetails.role as Role) : false;

  // If user doesn't have access, redirect
  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};

export const RejectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Check if user is logged in
  const location = useLocation(); // Get current location information

  return !isAuthenticated ? (
    // If NOT authenticated, render child routes (login/signup pages)
    <Outlet />
  ) : (
    // If ALREADY authenticated, redirect to:
    // 1. The page user was trying to access before login (if exists)
    // 2. Home page (if no previous location)
    <Navigate to={location.state?.from ?? "/"} replace />
  );
};
