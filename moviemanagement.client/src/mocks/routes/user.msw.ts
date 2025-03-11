import { http, HttpResponse } from "msw";
import { UserResponse } from "../../types/users.type";
import { Employee } from "../../pages/admin/QuanLyNhanVien/BangNhanVien";

export const handleGetUserDetail = (id: string) => {
  return http.get(`/api/user/detail/${id}`, () => {
    switch (id) {
      case "09ace9f8-a25a-4c92-80a1-17c08ebef2e1":
        return HttpResponse.json({
          userId: "09ace9f8-a25a-4c92-80a1-17c08ebef2e1",
          userName: "string",
          avatar: "string",
          joinDate: "2025-03-11T07:52:07.528",
          fullName: "Luu Cao Hoang",
          birthDate: "2025-03-11T07:52:07.528",
          gender: 0,
          idCard: "string",
          email: "m@gmail.com",
          phoneNumber: "string",
          address: "string",
          status: 1,
          role: 0,
          point: 0,
          ticket: {
            history: [
              {
                dateCreate: "01/01/2021",
                movieName: "Tên phim 1",
                plusPoint: 10,
                minusPoint: 0,
              },
              {
                dateCreate: "01/01/2021",
                movieName: "Tên phim 2",
                plusPoint: 10,
                minusPoint: 0,
              },
              {
                dateCreate: "01/01/2021",
                movieName: "Tên phim 3",
                plusPoint: 10,
                minusPoint: 0,
              },
            ],
            data: [
              {
                id: 1,
                movieName: "Tên phim 1",
                dateStart: "01/01/2021",
                dateEnd: "02/01/2021",
                time: "20:00",
                room: "Phòng 1",
                price: "100,000 VND",
                status: "Đợi nhận vé",
              },
              {
                id: 2,
                movieName: "Tên phim 2",
                dateStart: "01/01/2021",
                dateEnd: "02/01/2021",
                time: "20:00",
                room: "Phòng 1",
                price: "100,000 VND",
                status: "Đã nhận vé",
              },
              {
                id: 3,
                movieName: "Tên phim 3",
                dateStart: "01/01/2021",
                dateEnd: "02/01/2021",
                time: "20:00",
                room: "Phòng 1",
                price: "100,000 VND",
                status: "Đợi nhận vé",
              },
            ],
          },
        });

      case "596cb162-4c3f-47e7-91e4-491761d03454":
        return HttpResponse.json<UserResponse>({
          userId: "596cb162-4c3f-47e7-91e4-491761d03454",
          userName: "employee",
          avatar: "string",
          joinDate: "2025-03-08T16:12:07.003",
          fullName: "An Phuoc Dao",
          birthDate: "2025-03-08T16:12:07.003",
          gender: 0,
          idCard: "string",
          email: "e@gmail.com",
          phoneNumber: "string",
          address: "string",
          status: 0,
          role: 1,
          point: 0,
        });

      case "d3ddb1f7-22fa-42b3-bbe8-71dc29688ef2":
        return HttpResponse.json<UserResponse>({
          userId: "d3ddb1f7-22fa-42b3-bbe8-71dc29688ef2",
          userName: "admin",
          avatar: "string",
          joinDate: "2025-03-09T02:51:44.541",
          fullName: "Duong Nguyen Manh",
          birthDate: "2025-03-09T02:51:44.541",
          gender: 0,
          idCard: "string",
          email: "a@gmail.com",
          phoneNumber: "string",
          address: "string",
          status: 1,
          role: 2,
          point: 0,
        });

      default:
        return HttpResponse.error();
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
        HinhAnh:
          "https://images.unsplash.com/photo-1736784287983-49e7bf277eb9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ]);
  });
};

export const handleGetThanhVienDetail = (id: string) => {
  return http.get(`/api/thanh-vien/${id}`, () => {
    switch (id) {
      case "1":
        return HttpResponse.json({
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
        });
      case "2":
        return HttpResponse.json({
          MaNhanVien: "2",
          TenNhanVien: "user2",
          SoCMND: "234567890",
          Email: "user2@example.com",
          SoDienThoai: "234-567-8901",
          DiaChi: "234 Maple Ave",
          HinhAnh:
            "https://images.unsplash.com/photo-1736784287983-49e7bf277eb9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
      default:
        return HttpResponse.error();
    }
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
        HinhAnh:
          "https://images.unsplash.com/photo-1736784287983-49e7bf277eb9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ]);
  });
};

export const handleGetNhanVienDetail = (id: string) => {
  return http.get(`/api/nhan-vien/${id}`, () => {
    switch (id) {
      case "1":
        return HttpResponse.json<Employee>({
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
        });
      case "2":
        return HttpResponse.json<Employee>({
          MaNhanVien: "2",
          TenNhanVien: "user2",
          SoCMND: "234567890",
          Email: "user2@example.com",
          SoDienThoai: "234-567-8901",
          DiaChi: "234 Maple Ave",
          HinhAnh:
            "https://images.unsplash.com/photo-1736784287983-49e7bf277eb9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
      default:
        return HttpResponse.error();
    }
  });
};
