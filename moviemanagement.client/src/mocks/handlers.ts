import { HttpHandler } from "msw";
import {
  handleGetBookingDetail,
  handleGetCategoryList,
  handleGetFilmDetail,
  handleGetFilmList,
  handleGetNhanVien,
  handleGetNhanVienDetail,
  handleGetRoom,
  handleGetRoomDetail,
  handleGetThanhVien,
  handleGetThanhVienDetail,
  handleLogin,
  handleLogout,
  handleSignup,
} from "./routes";

export const handlers: HttpHandler[] = [
  handleGetThanhVien(),
  handleGetNhanVien(),
  handleGetThanhVienDetail("1"),
  handleGetThanhVienDetail("2"),
  handleGetNhanVienDetail("1"),
  handleGetNhanVienDetail("2"),
  handleGetRoom(),
  handleGetRoomDetail("1"),
  handleGetRoomDetail("2"),
  handleGetRoomDetail("3"),
  handleLogin(),
  handleSignup(),
  handleLogout(
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
  ),
  handleGetBookingDetail("BV00001"),
  handleGetFilmList("all"),
  handleGetFilmDetail("1"),
  handleGetFilmDetail("2"),
  handleGetCategoryList(),
];
