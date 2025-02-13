// src/pages/Register.tsx
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerValidationSchema } from "../../utils/validation.utils";
import { UserRegisterDTO } from "../../types/users.type";
import { register } from "../../apis/auth.apis";
import AuthFormContainer from "../../components/forms/AuthFormContainer";
import { extractErrorMessage } from "../../utils/errors.utils";
import FormField from "../../components/forms/FormField";
import CheckboxField from "../../components/forms/CheckboxField";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      receiveEmailNotifications: true,
      acceptPolicy: true,
    },
  });

  const onSubmit = async (data: UserRegisterDTO) => {
    try {
      const response = await register(data);
      toast.success("Registered successfully");
      setTimeout(() => {
        navigate("/otp-verification", {
          state: {
            email: data.email,
            from: "register",
            statusCode: 200,
          },
        });
      }, 3000);
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        "An error occurred during registration",
      );
      toast.error(errorMessage);
    }
  };

  return (
    <AuthFormContainer>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign up
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="first_name"
            label="First Name"
            control={control}
            errors={errors}
          />
          <FormField
            name="last_name"
            label="Last Name"
            control={control}
            errors={errors}
          />
        </div>

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

        <FormField
          name="confirm_password"
          label="Confirm Password"
          type="password"
          control={control}
          errors={errors}
        />

        <CheckboxField
          name="receiveEmailNotifications"
          label="Send me promotional emails about AuctionKoi auctions"
          control={control}
          errors={errors}
        />

        <CheckboxField
          name="acceptPolicy"
          label="I agree to the terms and policy *"
          control={control}
          errors={errors}
        />

        <Button
          type="submit"
          variant="contained"
          className="w-full py-2 px-4 hover:bg-blue-500 transition duration-300"
        >
          Submit
        </Button>

        <div className="flex justify-center items-center">
          <Typography
            variant="h6"
            sx={{ fontSize: "15px", textAlign: "center" }}
          >
            Already have an account?
          </Typography>

          <Link
            to="/login"
            className="ml-2 text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-200"
          >
            Login here
          </Link>
        </div>
      </form>
    </AuthFormContainer>
  );
};

export default Register;
