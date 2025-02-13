// src/pages/Login.tsx
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { login } from "~/apis/auth.apis";
import { sendOtpForgotPassword } from "~/apis/otp.apis";
import { routeUserToEachPage } from "~/components/auth/RoleBasedRoute";
import AuthFormContainer from "~/components/forms/AuthFormContainer";
import CheckboxField from "~/components/forms/CheckboxField";
import FormField from "~/components/forms/FormField";
import {
  GENERAL_TOAST_MESSAGE,
  LOGIN_FORM_TOAST_MESSAGE,
  OTP_TOAST_MESSAGE,
} from "~/constants/message";
import { emailRegex } from "~/constants/regex";
import { LoginDTO } from "~/types/users.type";
import { extractErrorMessage } from "~/utils/dataConverter";
import { loginValidationSchema } from "~/utils/validation.utils";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (
      !email ||
      !emailRegex.test(email) ||
      !(await yup.string().email().isValid(email))
    ) {
      toast.error(
        LOGIN_FORM_TOAST_MESSAGE.INVALID_EMAIL_FORGOT_PASSWORD_FORMAT,
      );
      return;
    }

    try {
      const response = await sendOtpForgotPassword(email);
      if (response.status === 200) {
        navigate("/otp-verification", {
          state: {
            email,
            from: "login",
            statusCode: 200,
          },
        });
      } else {
        toast.error(OTP_TOAST_MESSAGE.FAILED_TO_SEND_OTP);
      }
    } catch (error) {
      toast.error(GENERAL_TOAST_MESSAGE.UNEXPECTED_ERROR);
    }
  };

  const onSubmit = async (data: LoginDTO) => {
    try {
      const response = await login(data);

      if (response) {
        authLogin({
          token: response.token,
          roles: response.roles,
          id: response.id,
          username: response.username,
          refresh_token: response.refresh_token,
          status: response.status,
        });

        toast.success("Login successfully!");
        setTimeout(() => {
          navigate(routeUserToEachPage(response.roles[0]));
        }, 2000);
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "An error occurred during login",
      );
      toast.error(errorMessage);
    }
  };

  return (
    <AuthFormContainer>
      <form
        className="form flex flex-col gap-4 rounded-lg bg-white p-9 shadow-md w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-6 text-4xl text-center">Welcome back!</h1>

        <FormField
          name="email"
          label="Email Address"
          type="email"
          control={control}
          errors={errors}
        />

        <FormField
          name="password"
          label="Password"
          type="password"
          control={control}
          errors={errors}
        />

        <div className="flex justify-between items-center">
          <Button
            size="small"
            disableElevation
            variant="text"
            color="primary"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </Button>
          <CheckboxField
            name="rememberMe"
            label="Remember me"
            control={control}
            errors={errors}
          />
        </div>

        <button
          className="button-submit h-12 w-full rounded-lg bg-blue-500 text-xl font-bold text-white hover:bg-blue-600 transition duration-200"
          type="submit"
        >
          Log In
        </button>

        <div className="flex justify-center items-center">
          <Typography
            variant="h6"
            sx={{ fontSize: "15px", textAlign: "center" }}
          >
            Don&apos;t have an account?
          </Typography>

          <Link
            to="/register"
            className="ml-2 text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-200"
          >
            Register here
          </Link>
        </div>
      </form>
    </AuthFormContainer>
  );
};

export default Login;
