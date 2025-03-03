import axios from "axios";
import { ThanhVien } from "../pages/admin/QuanLyThanhVien/BangThanhVien";
import { Employee } from "../pages/admin/QuanLyNhanVien/BangNhanVien";
import { Room } from "../types/room.types";

export const fetchThanhVien = async (): Promise<ThanhVien[]> => {
  const response = await axios.get<ThanhVien[]>(
    "https://6512cbd2b8c6ce52b3963937.mockapi.io/api/v1/views",
  );
  return response.data;
};

export const fetchNhanVien = async (): Promise<Employee[]> => {
  const response = await axios.get<Employee[]>(
    "https://6512cbd2b8c6ce52b3963937.mockapi.io/api/v1/views",
  );
  return response.data;
};

export const fetchRoom = async (): Promise<Room[]> => {
  const response = await axios.get<Room[]>(
    "https://run.mocky.io/v3/d96238cd-5721-4b03-81ab-d6da466a048c",
  );
  return response.data;
};

export const fetchRoomDetail = async (id: string): Promise<Room> => {
  const response = await axios.get<Room>(
    id === "1"
      ? "https://run.mocky.io/v3/a46ca746-c33d-4946-92d9-5b44f60293c9"
      : "notfound",
  );
  return response.data;
};
