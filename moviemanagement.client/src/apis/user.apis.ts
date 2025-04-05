import axios from "axios";
import { SignupRequest } from "../types/auth.types";
import { UserResponse, UserTransactionHistory } from "../types/users.type";
import { ApiResponse } from "./api.config";
import api from "./axios.config";

export enum Role {
  Member = "Member",
  Employee = "Employee",
  Admin = "Admin",
}

export const fetchUserByRole = async (role: Role): Promise<ApiResponse<UserResponse[]>> => {
  const response = await api.get<ApiResponse<UserResponse[]>>(`/users/role/${role}`);

  console.log(`Fetched ${role} users:`, response.data);

  return response.data;
};

export const doInActiveUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.status === 204 ? true : false;
};

export const updateUserPartial = async (id: string, data: Partial<UserResponse>) => {
  const response = await api.patch<ApiResponse<UserResponse>>(`/users/${id}`, data);
  return response.status === 200 ? true : false;
};

export const fetchUserDetail = async (id: string) => {
  const response = await api.get<ApiResponse<UserResponse>>(`/users/detail/${id}`);
  return response.data;
};

export const fetchBillByUserId = async (id: string) => {
  const response = await axios.get<ApiResponse<UserTransactionHistory[]>>(`/api/mock/bill?id=${id}`);
  return response.data.data;
};
