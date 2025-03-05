import { http, HttpResponse } from "msw";
import { Room } from "../types/room.types";
import { Employee } from "../pages/admin/QuanLyNhanVien/BangNhanVien";
import { LoginRequest } from "../types/auth.types";

export const handleLogin = () => {
  return http.post("/api/login", async ({ request }) => {
    const body = (await request.json()) as LoginRequest;
    const { username, password } = body;

    if (username === "hoangdz1604@gmail.com" && password === "12345678") {
      return HttpResponse.json({
        message: "Login successfully",
        data: {
          token: {
            id: 2,
            access_token:
              "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
            refresh_token: "c6de39b5-f287-495b-b680-54be521479e0",
            token_type: "Bearer",
            expires: "2025-04-04T20:32:26.079Z",
            expires_refresh_token: "2025-05-04T20:32:26.079Z",
            is_mobile: null,
          },
        },
        status_code: 200,
        is_success: true,
      });
    } else {
      return HttpResponse.json({
        message: "Wrong email or password",
        status_code: 400,
        is_success: false,
        reason: "Bad credentials",
      });
    }
  });
};

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

export const handleGetRoomDetail = (roomId: string) => {
  return http.get(`/api/phong-chieu/${roomId}`, () => {
    switch (roomId) {
      case "1":
        return HttpResponse.json<Room>({
          roomId: "1",
          name: "Room 1",
          row: 5,
          column: 10,
          total: 50,
        });
      case "2":
        return HttpResponse.json<Room>({
          roomId: "2",
          name: "Room 2",
          row: 6,
          column: 12,
          total: 72,
        });
      case "3":
        return HttpResponse.json<Room>({
          roomId: "3",
          name: "Room 3",
          row: 7,
          column: 14,
          total: 98,
        });
      default:
        return HttpResponse.error();
    }
  });
};
