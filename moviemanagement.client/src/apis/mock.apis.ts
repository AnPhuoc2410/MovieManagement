import axios from "axios";
import { Employee } from "../pages/admin/QuanLyNhanVien/BangNhanVien";
import { ThanhVien } from "../pages/admin/QuanLyThanhVien/BangThanhVien";
import { Room } from "../types/room.types";

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
