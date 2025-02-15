import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract details from location.state (with defaults)
  const { selectedTime, selectedDate } = location.state || {
    selectedTime: "Not selected",
    selectedDate: "Not selected"
  };

  const {
    movieTitle = "Phim Mặc Định",
    screen = "Màn hình 1",
    showDate = selectedDate,
    showTime = selectedTime,
    seats = [] as string[],
    price = 100000,
    fullName = "",
    email = "",
    idNumber = "",
    phone = "",
  } = location.state || {};

  const total = seats.length * price;

  const handleHome = () => {
    navigate("/");
  };

  return (
    <>
      {/* Fixed header with StepTracker set to step 4 (confirmation) */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
        <StepTracker currentStep={4} />
      </Box>

      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          py: 15,
          px: { xs: 0, sm: 3 },
          backgroundColor: "#0B0D1A",
          color: "white",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom fontFamily={"JetBrains Mono"} sx={{ textTransform: "uppercase" }}>
          Xác Nhận Đặt Vé
        </Typography>

        <Grid container spacing={4} sx={{ px: { xs: 2, sm: 5 } }}>
          {/* Left Column: Movie Poster */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, backgroundColor: "#1c1c1c", color: "white" }}>
              <Box
                component="img"
                src="https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2025%2Fden-am-hon-poster.png&w=2048&q=75"
                alt="Movie Poster"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  objectFit: "cover",
                  maxHeight: 500,
                  mb: 2,
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, backgroundColor: "#1c1c1c", color: "white", mb: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom color="secondary">
                    Thông Tin Phim
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Tên phim:</strong> {movieTitle}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Màn hình:</strong> {screen}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Ngày chiếu:</strong> {showDate}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Giờ chiếu:</strong> {showTime}
                  </Typography>
                </Grid>

                {/* Right side: Ticket Information */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom color="secondary">
                    Thông Tin Vé
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Ghế:</strong> {seats.join(", ")}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Giá:</strong> {price.toLocaleString()} VND
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      color: "#fbc02d",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      mt: 1,
                    }}
                  >
                    <strong>Tổng cộng:</strong> {total.toLocaleString()} VND
                  </Typography>
                </Grid>
              </Grid>

              {/* Customer Information */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom color="secondary">
                  Thông Tin Khách Hàng
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Họ tên:</strong> {fullName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Email:</strong> {email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>CMND:</strong> {idNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Số điện thoại:</strong> {phone}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Box sx={{ textAlign: "center" }}>
              <Button variant="contained" color="success" onClick={handleHome}>
                Về trang chủ
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Confirmation;
