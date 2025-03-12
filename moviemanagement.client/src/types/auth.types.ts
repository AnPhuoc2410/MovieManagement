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
