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
  reason: string | null;
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
  gender: string | number;
  idCard: string;
  email: string;
  address: string;
  phoneNumber: string;
};

export type SignupResponse = ApiResponse<UserResponse>;

export type ExtractTokenResponse = {
  message: string;
  statusCode: number;
  reason: string | null;
  isSuccess: boolean;
  data: UserResponse;
};

export type OtpResponse = ApiResponse<string>;

export type UpdatePasswordReqBody = {
  email: string;
  newPassword: string;
  currentPassword?: string;
};
