import { UserBase } from "../types/users.type";

export const SampleMemberProfiles: UserBase[] = [
  {
    MaThanhVien: "1",
    TaiKhoan: "user123",
    MatKhau: "password123!",
    NgayThamGia: new Date("2022-06-15"),
    AnhDaiDien: "https://example.com/images/user123.jpg",
    HoTen: "Nguyen Van A",
    NgaySinh: "1990-01-10",
    GioiTinh: 1, // Male
    CMND: "0123456789",
    Email: "nguyenvana@example.com",
    SoDienThoai: "0901234567",
    DiaChi: "123 Main St, District 1, Ho Chi Minh City",
    DiemTichLuy: 1200,
    TrangThai: 1, // Active
  },
  {
    MaThanhVien: "2",
    TaiKhoan: "user456",
    MatKhau: "securePass456@",
    NgayThamGia: new Date("2023-01-25"),
    AnhDaiDien: "https://example.com/images/user456.jpg",
    HoTen: "Tran Thi B",
    NgaySinh: "1995-05-22",
    GioiTinh: 2, // Female
    CMND: "9876543210",
    Email: "tranthib@example.com",
    SoDienThoai: "0907654321",
    DiaChi: "456 Elm St, District 3, Ho Chi Minh City",
    DiemTichLuy: 850,
    TrangThai: 1, // Active
  },
  {
    MaThanhVien: "3",
    TaiKhoan: "user789",
    MatKhau: "myPass789#",
    NgayThamGia: new Date("2021-11-05"),
    AnhDaiDien: "https://example.com/images/user789.jpg",
    HoTen: "Le Van C",
    NgaySinh: "1988-09-18",
    GioiTinh: 1, // Male
    CMND: "6543210987",
    Email: "levanc@example.com",
    SoDienThoai: "0909876543",
    DiaChi: "789 Oak St, District 5, Ho Chi Minh City",
    DiemTichLuy: 500,
    TrangThai: 0, // Inactive
  },
];
