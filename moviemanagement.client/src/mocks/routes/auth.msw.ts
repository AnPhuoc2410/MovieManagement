import { http, HttpResponse } from "msw";
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  SignupRequest,
} from "../../types/auth.types";

export const handleLogin = () => {
  return http.post("/api/login", async ({ request }) => {
    const body = (await request.json()) as LoginRequest;
    const { email, password } = body;

    if (
      (email === "hoangdz1604@gmail.com" && password === "12345678") ||
      (email === "admin" && password === "admin")
    ) {
      return HttpResponse.json<LoginResponse>({
        message: "Login successfully",
        data: {
          token: {
            accessToken:
              "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
            expires: "2025-04-04T20:32:26.079Z",
          },
        },
        statusCode: 200,
        isSuccess: true,
      });
    } else if (email === "m@gmail.com" && password === "12345678") {
      return HttpResponse.json<LoginResponse>({
        message: "Login successfully",
        data: {
          token: {
            accessToken:
              "mJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
            expires: "2025-04-04T20:32:26.079Z",
          },
        },
        statusCode: 200,
        isSuccess: true,
      });
    } else if (email === "e@gmail.com" && password === "12345678") {
      return HttpResponse.json<LoginResponse>({
        message: "Login successfully",
        data: {
          token: {
            accessToken:
              "eJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
            expires: "2025-04-04T20:32:26.079Z",
          },
        },
        statusCode: 200,
        isSuccess: true,
      });
    } else if (email === "a@gmail.com" && password === "12345678") {
      return HttpResponse.json<LoginResponse>({
        message: "Login successfully",
        data: {
          token: {
            accessToken:
              "aJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
            expires: "2025-04-04T20:32:26.079Z",
          },
        },
        statusCode: 200,
        isSuccess: true,
      });
    } else {
      return HttpResponse.json({
        message: "Wrong email or password",
        statusCode: 400,
        isSuccess: false,
        reason: "Bad credentials",
      });
    }
  });
};

export const handleExtractToken = (at: string) => {
  return http.post("/api/auth/extract-token", async ({ request }) => {
    const body = (await request.json()) as { accessToken: string };
    const { accessToken } = body;

    if (accessToken === at) {
      return HttpResponse.json({
        message: "Token extracted successfully",
        statusCode: 200,
        isSuccess: true,
        data: {
          userId: "09ace9f8-a25a-4c92-80a1-17c08ebef2e1",
          userName: "string",
          avatar: "string",
          joinDate: "2025-03-11T07:52:07.528",
          fullName: "Luu Cao Hoang",
          birthDate: "2025-03-11T07:52:07.528",
          gender: 0,
          idCard: "string",
          email: "m@gmail.com",
          phoneNumber: "string",
          address: "string",
          status: 1,
          role: 0,
          point: 0,
        },
      });
    } else {
      return HttpResponse.json({
        message: "Token is invalid",
        statusCode: 400,
        isSuccess: false,
        reason: "Bad token",
      });
    }
  });
};

export const handleLogout = (token: string) => {
  return http.post("/api/auth/logout", async ({ request }) => {
    const body = (await request.json()) as LogoutRequest;
    const { token } = body;
    if (token) {
      return HttpResponse.json<LogoutResponse>({
        message: "Logout successfully",
        statusCode: 200,
        isSuccess: true,
      });
    } else {
      return HttpResponse.json({
        message: "Token is invalid",
        statusCode: 400,
        isSuccess: false,
        reason: "Bad token",
      });
    }
  });
};

export const handleSignup = () => {
  return http.post("/api/signup", async ({ request }) => {
    const body = (await request.json()) as SignupRequest;
    const {
      userName,
      password,
      fullName,
      birthDate,
      gender,
      idCard,
      email,
      address,
      phoneNumber,
    } = body;

    // Simulate an existing user check (replace with actual database checks in production)
    if (
      userName === "hoangdz1604@gmail.com" ||
      email === "hoangdz1604@gmail.com"
    ) {
      return HttpResponse.json({
        message: "Username or email already exists",
        statusCode: 400,
        isSuccess: false,
        data: null, // Data is null, per the SignupResponse type
      });
    }

    // Fake success response
    return HttpResponse.json({
      message: "Signup successful",
      statusCode: 200,
      isSuccess: true,
      data: null, // Data is null, per the SignupResponse type
    });
  });
};
