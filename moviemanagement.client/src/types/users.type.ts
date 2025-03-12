import { Role } from "./roles.type";
import { UserTicketHistory, UserTicketType } from "./ticketdetail.types";

export type UserBase = {
  MaThanhVien: string;
  TaiKhoan: string;
  MatKhau: string;
  NgayThamGia: Date;
  AnhDaiDien: string;
  HoTen: string;
  NgaySinh: string;
  GioiTinh: number;
  CMND: string;
  Email: string;
  SoDienThoai: string;
  DiaChi: string;
  DiemTichLuy: number;
  TrangThai: number;
};

export type UserResponse = {
  userId: string;
  userName: string;
  avatar: string;
  joinDate: string;
  fullName: string;
  birthDate: string;
  gender: number;
  idCard: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: number;
  role: number;
  point: number;
};

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
> & {
  ticket?: {
    history?: UserTicketHistory[];
    data?: UserTicketType[];
  };
};

export type LoginDTO = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type UserLoginResponse = {
  tokenType: string;
  id: number;
  username: string;
  roles: Role[];
  message: string;
  token: string;
  status: UserStatus;
  refresh_token: string;
};

export type UserRegisterResponse = {
  message: string;
  single_data: Omit<UserBase, "password">;
};

export type UserRegisterBase = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address?: string;
  date_of_birth?: string;
  google_account_id?: number;
};

export type UserRegisterDTO = UserRegisterBase & {
  confirm_password: string; // Unique field for UserRegisterDTO
  status: string;
  role_id: number;
  receiveEmailNotifications?: boolean;
  acceptPolicy?: boolean;
};

export type StaffRegisterDTO = Omit<UserRegisterBase, "password"> & {
  password: string;
  phone_number: string;
  is_active?: boolean | number;
  is_subscription?: boolean | number;
  avatar_url?: string;
};

export type Breeder = UserBase & {
  koi_count: number;
};
export type Member = UserBase & {
  order_count: number;
};
export type Staff = UserBase & {
  auction_count: number;
};

export type UserDetailsResponse = UserBase;

export type UserStatus = "UNVERIFIED" | "VERIFIED" | "BANNED";

export type UpdatePasswordDTO = {
  email: string;
  new_password: string;
};
