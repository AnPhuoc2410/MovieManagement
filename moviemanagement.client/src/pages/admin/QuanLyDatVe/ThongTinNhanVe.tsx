import {
  Box,
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
import { XacNhanDatVe } from "./ChiTietDatVe";
import Loader from "../../../components/shared/Loading/LoadingScreen";

const ThongTinNhanVe = () => {
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

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;

  const handleChangeTicket = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedChangeTicket(Number(event.target.value));
  };

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 2 }}>
        Thông tin nhận vé
      </Typography>

      <Card sx={{ display: "flex", marginBottom: 2 }}>
        <Box
          component="img"
          sx={{ height: 233, width: 350 }}
          alt="Movie banner"
          src={bookingDataDetail.MovieBanner}
        />
        <CardContent>
          <Typography variant="h4">{bookingDataDetail.mName}</Typography>
          <Typography>Màn hình: {bookingDataDetail.monitor}</Typography>
          <Typography>Ngày chiếu: {bookingDataDetail.datePremiere}</Typography>
          <Typography>Giờ chiếu: {bookingDataDetail.timePremiere}</Typography>
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
                ? bookingDataDetail.changeTicket.map((ticketOption, index) => (
                    <FormControlLabel
                      key={index}
                      value={ticketOption}
                      control={<Radio />}
                      label={`${ticketOption}`}
                    />
                  ))
                : null}
            </RadioGroup>
          </Box>
          Diem Doi Ve
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
            Số điện thoại: {bookingDataDetail.SoDienThoai}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ThongTinNhanVe;
