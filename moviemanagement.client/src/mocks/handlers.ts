import { HttpHandler } from "msw";
import { handleGetNhanVien, handleGetRoom, handleGetThanhVien } from "./routes";

export const handlers: HttpHandler[] = [
  handleGetThanhVien(),
  handleGetNhanVien(),
  handleGetRoom(),
];
