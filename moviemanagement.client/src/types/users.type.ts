import { UserTicketHistory, UserTicketType } from "./ticketdetail.types";

export type UserBase = {
  userId: string;
  userName: string;
  password: string;
  avatar: string | null;
  joinDate: string;
  fullName: string;
  birthDate: string | null;
  gender: number;
  idCard: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: number | 1;
  role: number;
  point: number;
};

export type AddEmployee = Omit<
  UserBase,
  "role" | "userId" | "point" | "status" | "joinDate"
> & {
  confirmPassword: string;
};

export interface UserResponse {
  userId: string;
  userName: string;
  avatar: string;
  joinDate: string;
  fullName: string;
  birthDate: string | null;
  gender: number;
  idCard: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: number;
  role: number;
  point: number;
}

export type UserProfile = Pick<
  UserResponse,
  | "birthDate"
  | "gender"
  | "idCard"
  | "fullName"
  | "email"
  | "phoneNumber"
  | "address"
  | "point"
  | "userName"
  | "avatar"
> & {
  ticket?: {
    history?: UserTicketHistory[];
    data?: UserTicketType[];
  };
};

export type UpdatePasswordDTO = {
  email: string;
  new_password: string;
};

export type UserInfo = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  membershipPoints: number;
  avatarUrl?: string;
};
