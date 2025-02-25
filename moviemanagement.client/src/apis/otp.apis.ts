import axios from "axios";
import { DYNAMIC_API_URL } from "../constants/endPoints";
import { handleAxiosError } from "../utils/errors.utils";
import { ERROR_MESSAGE } from "../constants/message";

export const sendOtp = async (email: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${DYNAMIC_API_URL}/otp/send?type=mail&recipient=${email}`,
    );
    if (response.status === 200) {
      console.log("OTP sent successfully");
    }
    return response;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.SEND_OTP_ERROR,
    );
  }
};

export const sendOtpForgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${DYNAMIC_API_URL}/forgot-password?toEmail=${email}`,
    );
    if (response.status === 200) {
      console.log("OTP sent successfully");
    }
    return response;
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      false,
      ERROR_MESSAGE.SEND_OTP_ERROR,
    );
  }
};

export const verifyOtpIsCorrect = async (
  email: string,
  otp: string,
): Promise<any> => {
  try {
    const response = await axios.post(`${DYNAMIC_API_URL}/otp/verify`, {
      email,
      otp,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    handleAxiosError(
      error,
      ERROR_MESSAGE.UNEXPECTED_ERROR,
      true,
      ERROR_MESSAGE.VERIFY_OTP_ERROR,
    );
  }
};
