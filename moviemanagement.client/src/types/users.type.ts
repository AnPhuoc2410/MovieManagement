import { Role } from "./roles.type";

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

export type UserResponse = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  address: string;
  password: string;
  is_active: number;
  is_subscription: number;
  status_name: UserStatus;
  date_of_birth: string;
  avatar_url: string;
  google_account_id: number;
  role_name: string;
  account_balance: number;
  created_at: string;
  updated_at: string;
};

export type UpdateUserDTO = {
  first_name: string | "";
  last_name: string;
  email: string;
  phone_number: string;
  password?: string;
  confirm_password?: string;
  address: string;
  status: UserStatus;
  date_of_birth: string;
  avatar_url: string;
  google_account_id: number;
  balance_account: number;
};
