import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthFormContainerProps {
  children: React.ReactNode;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    {children}
    <ToastContainer />
  </div>
);

export default AuthFormContainer;
