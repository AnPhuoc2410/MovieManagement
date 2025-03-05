import { HttpHandler } from "msw";
import {
  handleGetNhanVien,
  handleGetRoom,
  handleGetRoomDetail,
  handleGetThanhVien,
  handleLogin,
} from "./routes";

export const handlers: HttpHandler[] = [
  handleGetThanhVien(),
  handleGetNhanVien(),
  handleGetRoom(),
  handleGetRoomDetail("1"),
  handleLogin(),
];
