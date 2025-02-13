import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPasswordValidationSchema } from "~/utils/validation.utils";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUserPassword } from "~/apis/forgotpassword.apis";

const ForgotPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordValidationSchema),
  });

  const timeoutRef = useRef<number | null>(null);

  // Function to reset the timeout
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set timeout for 5 minutes (300000 milliseconds)
    timeoutRef.current = window.setTimeout(() => {
      toast.error("You have been inactive for 3 minutes. Please try again.");
      setTimeout(() => {
        navigate("/auth");
      }, 5000);
    }, 300000); // 5 minutes
  };

  // Effect to set up the inactivity timer
  useEffect(() => {
    // Set the initial timer
    resetTimeout();

    // Add event listeners for user activity
    const handleActivity = () => resetTimeout();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // Cleanup event listeners and timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  const onSubmit = async (data: { password: string }) => {
    if (!email) {
      toast.error("Email not provided. Please try again.");
      return;
    }

    try {
      await updateUserPassword({ email, new_password: data.password });
      toast.success("Password has been reset successfully");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/auth"); // Redirect if no email in location state
    }
  }, [email, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4">Create New Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <div className="mb-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("password")}
              className={`w-full h-12 text-xl border rounded-md p-3 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className={`w-full h-12 text-xl border rounded-md p-3 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 w-full"
        >
          Reset Password
        </button>
        <div>
          *Note: This form will expire in 3 minutes if left inactive, please
          complete the form within the time limit.
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
