import axios from "axios";
import { Employee } from "../pages/admin/QuanLyNhanVien/BangNhanVien";
import { ThanhVien } from "../pages/admin/QuanLyThanhVien/BangThanhVien";
import { Room } from "../types/room.types";
import {
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../types/auth.types";
import { XacNhanDatVe } from "../pages/admin/QuanLyDatVe/ChiTietDatVe";
import { ApiResponse } from "./api.config";

export const fetchThanhVien = async (): Promise<ThanhVien[]> => {
  const response = await axios.get<ThanhVien[]>("/api/thanh-vien");
  return response.data;
};

export const fetchNhanVien = async (): Promise<Employee[]> => {
  const response = await axios.get<Employee[]>("/api/nhan-vien");
  return response.data;
};

export const fetchRoom = async (): Promise<Room[]> => {
  const response = await axios.get<Room[]>("/api/phong-chieu");
  return response.data;
};

export const fetchRoomDetail = async (id: string): Promise<Room> => {
  const response = await axios.get<Room>(`/api/phong-chieu/${id}`);
  return response.data;
};

export const login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await axios.post("/api/login", { username, password });
  return response.data;
};

export const getBookingDetail = async (
  bookingId: string,
): Promise<XacNhanDatVe> => {
  const response = await axios.get<XacNhanDatVe>(`/api/booking/${bookingId}`);
  return response.data;
};

export const signUp = async (
  signupData: SignupRequest,
): Promise<ApiResponse<SignupResponse>> => {
  try {
    const response = await axios.post("/api/signup", signupData);
    return response.data;
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An unexpected error occurred.",
      status_code: error.response?.status || 500,
      is_success: false,
      data: null,
    };
  }
};

export const getFilmList = async () => {
  const response = await axios.get("/api/films");
  return response.data;
};
