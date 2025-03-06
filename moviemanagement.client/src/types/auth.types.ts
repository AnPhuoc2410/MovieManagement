export type AuthLoginData = Pick<
  TokenResponse,
  "access_token" | "token_type" | "expires" | "is_mobile"
>;

export type LoginRequest = {
  username: string;
  password: string;
};

export type TokenResponse = {
  id: number;
  access_token: string;
  token_type: string;
  expires: string;
  is_mobile: boolean;
};

export type LoginResponse = {
  message: string;
  data: {
    token: TokenResponse;
  };
  status_code: number;
  is_success: boolean;
};

export type LogoutRequest = {
  token: string;
};

export type LogoutResponse = {
  message: string;
  status_code: number;
  is_success: boolean;
};

/*      username: "",
      password: "",
      fullname: "",
      dob: "",
      gender: "",
      cmnd: "",
      email: "",
      address: "",
      phone: "", */

export type SignupRequest = {
  username: string;
  password: string;
  fullname: string;
  dob: string;
  gender: string;
  cmnd: string;
  email: string;
  address: string;
  phone: string;
};

export type SignupResponse = {
  data: null;
};
