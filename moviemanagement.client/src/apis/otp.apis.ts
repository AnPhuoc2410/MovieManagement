import axios from "axios";
import api from "./axios.config";

export const sendOtp = async (email: string): Promise<any> => {
  const response = await api.get(`/otp/send?type=mail&recipient=${email}`);
  if (response.status === 200) {
    console.log("OTP sent successfully");
  }
  return response;
};

export const sendOtpForgotPassword = async (email: string): Promise<any> => {
  const response = await axios.get(`/forgot-password?toEmail=${email}`);
  if (response.status === 200) {
    console.log("OTP sent successfully");
  }
  return response;
};

export const verifyOtpIsCorrect = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const response = await api.patch(`/auth/otp/verify`, {
    email,
    code,
  });

  return response.status === 200;
};
