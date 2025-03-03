import { http, HttpResponse } from "msw";
import { Room } from "../types/room.types";
import { Employee } from "../pages/admin/QuanLyNhanVien/BangNhanVien";

export const handleGetThanhVien = () => {
  return http.get("/api/thanh-vien", () => {
    return HttpResponse.json([
      {
        MaNhanVien: "1",
        TenNhanVien: "John Doe",
        SoCMND: "123456789",
        Email: "john@example.com",
        SoDienThoai: "0123456789",
        DiaChi: "123 Street",
        HinhAnh:
          "https://images.unsplash.com/photo-1736784287983-49e7bf277eb9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        TaiKhoan: "johndoe",
        MatKhau: "password",
        NgaySinh: "1990-01-01",
        GioiTinh: "Male",
      },
      {
        MaNhanVien: "2",
        TenNhanVien: "user2",
        SoCMND: "234567890",
        Email: "user2@example.com",
        SoDienThoai: "234-567-8901",
        DiaChi: "234 Maple Ave",
      },
      {
        MaNhanVien: "3",
        TenNhanVien: "user3",
        SoCMND: "345678901",
        Email: "user3@example.com",
        SoDienThoai: "345-678-9012",
        DiaChi: "345 Oak St",
      },
    ]);
  });
};

export const handleGetNhanVien = () => {
  return http.get("/api/nhan-vien", () => {
    return HttpResponse.json<Employee[]>([
      {
        MaNhanVien: "1",
        TenNhanVien: "John Doe",
        SoCMND: "123456789",
        Email: "john@example.com",
        SoDienThoai: "0123456789",
        DiaChi: "123 Street",
        HinhAnh:
          "https://images.unsplash.com/photo-1736784287983-49e7bf277eb9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        TaiKhoan: "johndoe",
        MatKhau: "password",
        NgaySinh: "1990-01-01",
        GioiTinh: "Male",
      },
      {
        MaNhanVien: "2",
        TenNhanVien: "user2",
        SoCMND: "234567890",
        Email: "user2@example.com",
        SoDienThoai: "234-567-8901",
        DiaChi: "234 Maple Ave",
      },
      {
        MaNhanVien: "3",
        TenNhanVien: "user3",
        SoCMND: "345678901",
        Email: "user3@example.com",
        SoDienThoai: "345-678-9012",
        DiaChi: "345 Oak St",
      },
    ]);
  });
};

export const handleGetRoom = () => {
  return http.get("/api/phong-chieu", () => {
    return HttpResponse.json<Room[]>([
      {
        roomId: "1",
        name: "Room 1",
        row: 5,
        column: 10,
        total: 50,
      },
      {
        roomId: "2",
        name: "Room 2",
        row: 6,
        column: 12,
        total: 72,
      },
      {
        roomId: "3",
        name: "Room 3",
        row: 7,
        column: 14,
        total: 98,
      },
    ]);
  });
};
