import { ApiResponse } from "../apis/api.config";
import { UserResponse } from "./users.type";

export type AuthLoginData = Pick<TokenResponse, "accessToken" | "expires">;

export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  expires: string;
};

export type LoginResponse = {
  message: string;
  data: {
    token: TokenResponse;
  };
  statusCode: number;
  isSuccess: boolean;
};

export type LogoutRequest = {
  token: string;
};

export type LogoutResponse = {
  message: string;
  statusCode: number;
  isSuccess: boolean;
};

export type SignupRequest = {
  userName: string;
  password: string;
  fullName: string;
  birthDate: string;
  gender: string;
  idCard: string;
  email: string;
  address: string;
  phoneNumber: string;
};

export type SignupResponse = ApiResponse<UserResponse>;
