import { HttpHandler } from "msw";
import { handleGetNhanVien, handleGetNhanVienDetail, handleGetThanhVien, handleGetThanhVienDetail, handleGetUserDetail, mockBillDetail } from "./routes/user.msw";
import { handleExtractToken, handleLogin, handleLogout, handleSignup } from "./routes/auth.msw";
import { handleGetCategoryList } from "./routes/category.msw";

export const handlers: HttpHandler[] = [
  handleGetThanhVien(),
  handleGetNhanVien(),
  handleGetThanhVienDetail("1"),
  handleGetThanhVienDetail("2"),
  handleGetNhanVienDetail("1"),
  handleGetNhanVienDetail("2"),
  handleLogin(),
  handleSignup(),
  handleLogout(
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
  ),
  handleExtractToken(
    "mJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwic3ViIjoiaG9hbmdkejE2MDRAZ21haWwuY29tIiwiZXhwIjoxNzQzNzczNTQ2fQ.N9P8pbirVxDlr1XP-AI5uCU_lDNw3uhZSCzWxnxNhVo",
  ),
  handleGetCategoryList(),
  handleGetUserDetail("09ace9f8-a25a-4c92-80a1-17c08ebef2e1"),
  handleGetUserDetail("596cb162-4c3f-47e7-91e4-491761d03454"),
  handleGetUserDetail("d3ddb1f7-22fa-42b3-bbe8-71dc29688ef2"),
  mockBillDetail("e0c6ccb9-83e3-4f51-9655-31223e09203b"),
];
