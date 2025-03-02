import axios from "axios";
import { ThanhVien } from "../pages/admin/QuanLyThanhVien/BangThanhVien";
import { Employee } from "../pages/admin/QuanLyNhanVien/BangNhanVien";

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
