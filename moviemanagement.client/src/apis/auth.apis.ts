import axios from "axios";
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  OtpResponse,
  SignupRequest,
  SignupResponse,
  UpdatePasswordReqBody,
} from "../types/auth.types";
import { UserResponse } from "../types/users.type";
import { ApiResponse } from "./api.config";
import api from "./axios.config";

export const login = async (
  user: LoginRequest,
): Promise<LoginResponse | null> => {
  try {
    const response = await api.post("/auth/login", {
      email: user.email,
      password: user.password,
    });
    return response.data;
  } catch (error) {
    console.log(`Login error: ${error}`);
    // throw error;
    return null;
  }
};

export const signup = async (
  payload: SignupRequest,
): Promise<SignupResponse> => {
  try {
    const response = await api.post(`/auth/register`, payload);
    return response.data;
  } catch (error: unknown) {
    console.log(`Signup error: ${error}`);

    // Type guard for axios error
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as SignupResponse;
    }

    // Create a default error response
    const errorResponse: SignupResponse = {
      message: "An unexpected error occurred",
      statusCode: 500,
      isSuccess: false,
      reason: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };

    return errorResponse;
  }
};

export const doLogout = async (token: string): Promise<LogoutResponse> => {
  const response = await axios.post(
    `/api/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in Authorization header
      },
    },
  );

  return response.data;
};

export const doExtractUserFromToken = async (
  token: string,
): Promise<ApiResponse<UserResponse>> => {
  const res = await api.post("/auth/extract-token", {
    accessToken: token,
  });
  return res.data;
};

export const doSendOTPToExistUser = async (
  email: string,
): Promise<string | null> => {
  const response = await api.patch(`/auth/send-otp?email=${email}`);
  try {
    if (response.status !== 200) throw new Error(response.data.message);

    return response.data.data;
  } catch (error) {
    console.log(`Find email error: ${error}`);
    return null;
  }
};

export const doUpdatePassword = async (data: UpdatePasswordReqBody) => {
  const response = await api.patch("/auth/update-password", data);
  return response.status === 200;
};
