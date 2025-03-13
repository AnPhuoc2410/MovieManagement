import axios from "axios";
import { XacNhanDatVe } from "../pages/admin/QuanLyDatVe/ChiTietDatVe";
import { Employee } from "../pages/admin/QuanLyNhanVien/BangNhanVien";
import { ThanhVien } from "../pages/admin/QuanLyThanhVien/BangThanhVien";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../types/auth.types";
import { Category } from "../types/category.types";
import { Movie, QuanLyPhimType } from "../types/movie.types";
import { Room } from "../types/room.types";
import {
  UpdatePasswordDTO,
  UserProfile,
  UserResponse,
} from "../types/users.type";
import { ApiResponse } from "./api.config";
import api from "./axios.config";

export const fetchThanhVien = async (): Promise<ThanhVien[]> => {
  const response = await axios.get<ThanhVien[]>("/api/thanh-vien");
  return response.data;
};

export const fetchThanhVienDetail = async (id: string): Promise<ThanhVien> => {
  const response = await axios.get<ThanhVien>(`/api/thanh-vien/${id}`);
  return response.data;
};

export const fetchNhanVien = async (): Promise<Employee[]> => {
  const response = await axios.get<Employee[]>("/api/nhan-vien");
  return response.data;
};

export const fetchNhanVienDetail = async (id: string): Promise<Employee> => {
  const response = await axios.get<Employee>(`/api/nhan-vien/${id}`);
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

export const login = async (user: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/authenticate/login", {
    email: user.email,
    password: user.password,
  });
  return response.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await axios.post("/api/auth/logout");
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
      statusCode: error.response?.status || 500,
      isSuccess: false,
      reason: error.response?.data?.reason || null,
      data: null,
    };
  }
};

export const getFilmList = async (query: string): Promise<QuanLyPhimType[]> => {
  const response = await axios.get<QuanLyPhimType[]>(
    `/api/films?query=${query}`,
  );
  return response.data;
};

export const getFilmDetail = async (id: string): Promise<Movie> => {
  const response = await axios.get<Movie>(`/api/films/${id}`);
  return response.data;
};

export const getCategoryList = async (): Promise<Category[]> => {
  const response = await axios.get<Category[]>("/api/categories");
  return response.data;
};

export const updateUserPassword = async (
  newPassword: UpdatePasswordDTO,
): Promise<ApiResponse<null>> => {
  const response = await axios.put("/api/auth/update-password", newPassword);
  return response.data;
};

export const getUserDetail = async (id: string): Promise<UserProfile> => {
  const response = await axios.get<UserProfile>(`/api/user/detail/${id}`);
  return response.data;
};

export const extractUserFromToken = async (
  accessToken: string,
): Promise<UserResponse> => {
  const response = await axios.post<UserResponse>("/api/auth/extract-user", {
    accessToken,
  });

  return response.data;
};
