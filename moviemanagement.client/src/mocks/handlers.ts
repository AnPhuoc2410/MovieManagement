import { HttpHandler } from "msw";
import {
  handleGetBookingDetail,
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
  handleLogin(),
  handleSignup(),
  handleGetBookingDetail("BV00001"),
];
