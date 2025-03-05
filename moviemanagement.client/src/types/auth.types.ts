import { UserLoginResponse } from "./users.type";

export type AuthLoginData = Pick<
  UserLoginResponse,
  "token" | "roles" | "id" | "username" | "status"
>;

export type LoginRequest = {
  username: string;
  password: string;
};

type TokenResponse = {
  id: number;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires: string;
  expires_refresh_token: string;
  is_mobile: boolean;
};

export type LoginResponse = {
  message: string;
  data: TokenResponse;
  status_code: number;
  is_success: boolean;
};
