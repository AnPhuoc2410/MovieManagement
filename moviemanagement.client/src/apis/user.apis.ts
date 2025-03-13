import { UserResponse } from "../types/users.type";
import { ApiResponse } from "./api.config";
import api from "./axios.config";

export enum Role {
  Member = "Member",
  Employee = "Employee",
  Admin = "Admin",
}

export const fetchUserByRole = async (
  role: Role,
): Promise<ApiResponse<UserResponse[]>> => {
  const response = await api.get<ApiResponse<UserResponse[]>>(
    `/users/role/${role}`,
  );
  return response.data;
};
