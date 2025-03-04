import { HttpHandler } from "msw";
import {
  handleGetNhanVien,
  handleGetRoom,
  handleGetRoomDetail,
  handleGetThanhVien,
} from "./routes";

export const handlers: HttpHandler[] = [
  handleGetThanhVien(),
  handleGetNhanVien(),
  handleGetRoom(),
  handleGetRoomDetail("1"),
];
