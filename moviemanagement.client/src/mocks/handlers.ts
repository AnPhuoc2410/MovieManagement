import { HttpHandler } from "msw";
import {
  handleGetBookingDetail,
  handleGetCategoryList,
  handleGetFilmDetail,
  handleGetFilmList,
  handleGetNhanVien,
  handleGetRoom,
  handleGetRoomDetail,
  handleGetThanhVien,
  handleLogin,
  handleSignup,
} from "./routes";

export const handlers: HttpHandler[] = [
  handleGetThanhVien(),
  handleGetNhanVien(),
  handleGetRoom(),
  handleGetRoomDetail("1"),
  handleGetRoomDetail("2"),
  handleGetRoomDetail("3"),
  handleLogin(),
  handleSignup(),
  handleGetBookingDetail("BV00001"),
  handleGetFilmList("all"),
  handleGetFilmDetail("1"),
  handleGetFilmDetail("2"),
  handleGetCategoryList(),
];
