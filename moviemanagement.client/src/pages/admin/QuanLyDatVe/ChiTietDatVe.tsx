import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getBookingDetail } from "../../../apis/mock.apis";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { UserBase } from "../../../types/users.type";

export type XacNhanDatVe = {
  mName: string;
  monitor: string;
  datePremiere: string;
  timePremiere: string;
  seat: string[]; // Explicitly define as string array
  price: string[];
  total: number;
  changeTicket: number[];
  DiemThanhVien: number;
  MovieBanner: string;
} & Pick<UserBase, "MaThanhVien" | "CMND" | "HoTen" | "SoDienThoai">;

import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";

// Components
const ChiTietDatVe: React.FC = ({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) => {
  const { bId } = useParams();
  const navigate = useNavigate();
  const [selectedChangeTicket, setSelectedChangeTicket] = useState(0);

  const {
    data: bookingDataDetail = {
      mName: "",
      monitor: "",
      datePremiere: "",
      timePremiere: "",
      seat: [], // Initialize as empty array
      price: [],
      total: 0,
      changeTicket: [],
      DiemThanhVien: 0,
      MaThanhVien: "",
      CMND: "",
      HoTen: "",
      SoDienThoai: "",
      MovieBanner: "",
    },
    isLoading,
    error,
  } = useQuery<XacNhanDatVe>("bookingData", () =>
    getBookingDetail(bId as string),
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Failed to fetch data</div>;

  const handleChangeTicket = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedChangeTicket(Number(event.target.value));
  };
  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SideMenu />

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppNavbar />

          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflowY: "auto",
              px: 3,
              py: 2,
            })}
          >
            <Stack spacing={2} alignItems="center">
              <Header />
              <Container>
                <Typography
                  variant="h3"
                  align="center"
                  gutterBottom
                  sx={{ mt: 2 }}
                >
                  Xác nhận đặt vé
                </Typography>

                <Card sx={{ display: "flex", marginBottom: 2 }}>
                  <Box
                    component="img"
                    sx={{ height: 233, width: 350 }}
                    alt="Movie banner"
                    src={bookingDataDetail.MovieBanner}
                  />
                  <CardContent>
                    <Typography variant="h4">
                      {bookingDataDetail.mName}
                    </Typography>
                    <Typography>
                      Màn hình: {bookingDataDetail.monitor}
                    </Typography>
                    <Typography>
                      Ngày chiếu: {bookingDataDetail.datePremiere}
                    </Typography>
                    <Typography>
                      Giờ chiếu: {bookingDataDetail.timePremiere}
                    </Typography>
                    <Typography>
                      Ghế:{" "}
                      {Array.isArray(bookingDataDetail.seat)
                        ? bookingDataDetail.seat.join(", ")
                        : "Không có thông tin ghế"}
                    </Typography>
                    <Typography>
                      Giá:{" "}
                      {Array.isArray(bookingDataDetail.seat) &&
                      Array.isArray(bookingDataDetail.price)
                        ? bookingDataDetail.seat.map((seat, index) => (
                            <div key={index}>
                              {seat}: {bookingDataDetail.price[index] || "N/A"}
                            </div>
                          ))
                        : "Không có thông tin giá"}
                    </Typography>
                    <Typography variant="h6">
                      Tổng cộng: {bookingDataDetail.total}đ
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Thông tin thành viên
                    </Typography>
                    <Typography>
                      Mã thành viên: {bookingDataDetail.MaThanhVien}
                    </Typography>
                    <Typography>CMND: {bookingDataDetail.CMND}</Typography>
                    <Typography>Họ tên: {bookingDataDetail.HoTen}</Typography>
                    <Typography>
                      Điểm thành viên: {bookingDataDetail.DiemThanhVien}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Typography variant="h6">Đổi vé</Typography>
                      <RadioGroup
                        value={selectedChangeTicket}
                        onChange={handleChangeTicket}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {Array.isArray(bookingDataDetail.changeTicket)
                          ? bookingDataDetail.changeTicket.map(
                              (ticketOption, index) => (
                                <FormControlLabel
                                  key={index}
                                  value={ticketOption}
                                  control={<Radio />}
                                  label={`${ticketOption}`}
                                />
                              ),
                            )
                          : null}
                      </RadioGroup>
                    </Box>
                    <Typography>
                      Số điện thoại: {bookingDataDetail.SoDienThoai}
                    </Typography>
                  </CardContent>
                </Card>

                <Box display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => {
                      navigate("/admin/ql-dat-ve/thong-tin-nhan-ve/" + bId);
                    }}
                  >
                    Xác nhận đặt vé
                  </Button>
                </Box>
              </Container>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ChiTietDatVe;
