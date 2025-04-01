import axios from "axios";
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignupRequest,
  SignupResponse,
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
