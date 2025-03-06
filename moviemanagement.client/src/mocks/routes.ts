import { http, HttpResponse } from "msw";
import { XacNhanDatVe } from "../pages/admin/QuanLyDatVe/ChiTietDatVe";
import { Employee } from "../pages/admin/QuanLyNhanVien/BangNhanVien";
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  SignupRequest,
} from "../types/auth.types";
import { Category } from "../types/category.types";
import { Movie, QuanLyPhimType } from "../types/movie.types";
import { Room } from "../types/room.types";

export const handleLogin = () => {
  return http.post("/api/login", async ({ request }) => {
    const body = (await request.json()) as LoginRequest;
    const { username, password } = body;

    if (
      (username === "hoangdz1604@gmail.com" && password === "12345678") ||
      (username === "admin" && password === "admin")
    ) {
      return HttpResponse.json<LoginResponse>({
        message: "Login successfully",
        data: {
          token: {
            id: 2,
            access_token:
              "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
            token_type: "Bearer",
            expires: "2025-04-04T20:32:26.079Z",
            is_mobile: false,
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

export const handleLogout = (token: string) => {
  return http.post("/api/auth/logout", async ({ request }) => {
    const body = (await request.json()) as LogoutRequest;
    const { token } = body;
    if (token) {
      return HttpResponse.json<LogoutResponse>({
        message: "Logout successfully",
        status_code: 200,
        is_success: true,
      });
    } else {
      return HttpResponse.json({
        message: "Token is invalid",
        status_code: 400,
        is_success: false,
        reason: "Bad token",
      });
    }
  });
};

export const handleSignup = () => {
  return http.post("/api/signup", async ({ request }) => {
    const body = (await request.json()) as SignupRequest;
    const {
      username,
      password,
      fullname,
      dob,
      gender,
      cmnd,
      email,
      address,
      phone,
    } = body;

    // Simulate an existing user check (replace with actual database checks in production)
    if (
      username === "hoangdz1604@gmail.com" ||
      email === "hoangdz1604@gmail.com"
    ) {
      return HttpResponse.json({
        message: "Username or email already exists",
        status_code: 400,
        is_success: false,
        data: null, // Data is null, per the SignupResponse type
      });
    }

    // Fake success response
    return HttpResponse.json({
      message: "Signup successful",
      status_code: 200,
      is_success: true,
      data: null, // Data is null, per the SignupResponse type
    });
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

export const handleGetBookingDetail = (bookingId: string) => {
  return http.get(`/api/booking/${bookingId}`, () => {
    return HttpResponse.json<XacNhanDatVe>({
      mName: "Đại chiến giữa những vì sao",
      monitor: "Scrn02",
      datePremiere: "25-01-2017",
      timePremiere: "08-20",
      seat: ["B8", "B9", "B10", "C10"],
      price: ["B8: 45000đ", "B8: 45000đ", "B8: 45000đ"],
      total: 180000,
      MaThanhVien: "TV0000012",
      CMND: "191816354",
      HoTen: "Nguyễn Văn A",
      DiemThanhVien: 1200,
      changeTicket: [0, 1, 2],
      SoDienThoai: "0901234567",
      MovieBanner:
        "https://images.unsplash.com/photo-1578632749014-ca77efd052eb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    });
  });
};

export const handleGetFilmList = (query: string) => {
  return http.get(`/api/films?query=${query}`, () => {
    switch (query) {
      case "all":
        return HttpResponse.json<QuanLyPhimType[]>([
          {
            movieId: "1",
            name: "SCANDAL",
            postDate: new Date("2021-12-01"),
            director: "Shusuke Kaneko",
            duration: 221,
            version: 2,
          },
          {
            movieId: "2",
            name: "Spider man",
            postDate: new Date("2021-12-01"),
            director: "Shusuke Kaneko",
            duration: 213,
            version: 2,
          },
        ]);

      default:
        return HttpResponse.error();
    }
  });
};

export const handleGetFilmDetail = (id: string) => {
  return http.get(`/api/films/${id}`, () => {
    switch (id) {
      case "1":
        return HttpResponse.json<Movie>({
          movieId: "1",
          name: "SCANDAL",
          image: "https://via.placeholder.com/150",
          postDate: new Date("2021-12-01"),
          fromDate: new Date("2021-12-01"),
          toDate: new Date("2021-12-01"),
          actors: "Shusuke Kaneko",
          director: "Shusuke Kaneko",
          rating: "5",
          duration: 221,
          version: 2,
          trailer: "https://www.youtube.com/watch?v=1",
          content: "A great movie",
          categories: [
            {
              categoryId: "1",
              name: "Action",
              description: "Hehehehe",
            },
            {
              categoryId: "2",
              name: "Action",
              description: "Hehehehe",
            },
            {
              categoryId: "3",
              name: "Action",
              description: "Hehehehe",
            },
          ],
          showtimes: [
            {
              showTimeId: "1",
              movieId: "1",
              roomId: "1",
              startTime: new Date("2021-12-01"),
            },
          ],
        });

      case "2":
        return HttpResponse.json<Movie>({
          movieId: "2",
          name: "Spider man",
          image: "https://via.placeholder.com/150",
          postDate: new Date("2021-12-01"),
          fromDate: new Date("2021-12-01"),
          toDate: new Date("2021-12-01"),
          actors: "Shusuke Kaneko",
          director: "Shusuke Kaneko",
          rating: "5",
          duration: 221,
          version: 2,
          trailer: "https://www.youtube.com/watch?v=1",
          content: "A great movie",
          categories: [
            {
              categoryId: "1",
              name: "Action",
              description: "Hehehehe",
            },
            {
              categoryId: "2",
              name: "Action",
              description: "Hehehehe",
            },
            {
              categoryId: "3",
              name: "Action",
              description: "Hehehehe",
            },
          ],
          showtimes: [
            {
              showTimeId: "1",
              movieId: "1",
              roomId: "1",
              startTime: new Date("2021-12-01"),
            },
          ],
        });
      default:
        return HttpResponse.error();
    }
  });
};

export const handleGetCategoryList = () => {
  return http.get("/api/categories", () => {
    return HttpResponse.json<Category[]>([
      {
        categoryId: "1",
        name: "Hành động",
      },
      {
        categoryId: "2",
        name: "Viễn tưởng",
      },
      {
        categoryId: "3",
        name: "Hoạt hình",
      },
      {
        categoryId: "4",
        name: "Võ thuật",
      },
      {
        categoryId: "5",
        name: "Hài hước",
      },
      {
        categoryId: "6",
        name: "Chiến tranh",
      },
      {
        categoryId: "7",
        name: "Kinh dị",
      },
      {
        categoryId: "8",
        name: "Kinh điển",
      },
      {
        categoryId: "9",
        name: "Lãng mạn",
      },
      {
        categoryId: "10",
        name: "Kiếm hiệp",
      },
      {
        categoryId: "11",
        name: "Phiêu lưu",
      },
      {
        categoryId: "12",
        name: "Tâm lý",
      },
      {
        categoryId: "13",
        name: "Tình cảm",
      },
      {
        categoryId: "14",
        name: "Âm nhạc",
      },
    ]);
  });
};
