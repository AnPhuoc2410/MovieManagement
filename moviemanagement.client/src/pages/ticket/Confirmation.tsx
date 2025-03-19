import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
import { CancelOutlined } from "@mui/icons-material";

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failure">();

  // Extract details from location.state (with defaults)
  const bookingInfo = JSON.parse(sessionStorage.getItem("bookingInfo") || "{}");

  const {
    selectedTime = "Not selected",
    selectedDate = "Not selected",
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
    total = seats.length * price,
  } = bookingInfo;

  const handleHome = () => {
    navigate("/");
  };

  const handlePayment = async () => {
    const queryParams = new URLSearchParams(location.search);
    const isSuccess = queryParams.get("isSuccess");

    if (isSuccess === "true") {
      console.log("Payment successful!");
      setPaymentStatus("success");
    } else {
      console.log("Payment failed or not completed.");
      setPaymentStatus("failure");
    }
  };

  useEffect(() => {
    handlePayment();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom,
          rgba(11, 13, 26, 0.95) 0%,
          rgba(11, 13, 26, 0.85) 100%
        )`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 30%, rgba(78, 46, 131, 0.4) 0%, rgba(78, 46, 131, 0) 50%),
                      radial-gradient(circle at 75% 15%, rgba(33, 64, 154, 0.4) 0%, rgba(33, 64, 154, 0) 50%),
                      linear-gradient(135deg, #0B0D1A 0%, #1A1E3C 50%, #3A1155 100%)`,
          zIndex: -1,
        },
      }}
    >
      <Header />

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: "64px", sm: "72px", md: "80px" },
          pb: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3, md: 4 },
            color: "white",
            position: "relative",
            minHeight: "100vh",
          }}
        >
          {/* Sticky StepTracker for desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
              height: "fit-content",
              width: "250px",
              flexShrink: 0,
            }}
          >
            <StepTracker currentStep={4} paymentStatus={paymentStatus} />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3, md: 4 },
              pb: 4,
            }}
          >
            {/* Show StepTracker on mobile */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              <StepTracker currentStep={4} paymentStatus={paymentStatus} />
            </Box>

            <Grid container spacing={4}>
              {/* Left Column: Movie Poster */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(28, 28, 28, 0.7)",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    component="img"
                    src="https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2025%2Fden-am-hon-poster.png&w=2048&q=75"
                    alt="Movie Poster"
                    sx={{
                      width: "100%",
                      borderRadius: 1,
                      objectFit: "cover",
                      maxHeight: 500,
                      boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                    }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(28, 28, 28, 0.7)",
                    color: "white",
                    mb: 3,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontFamily={"JetBrains Mono"}
                    sx={{ mb: 3, color: "#90caf9" }}
                  >
                    Thông Tin Đặt Vé
                  </Typography>

                  <Divider
                    sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }}
                  />

                  <Grid container spacing={3}>
                    {/* Thông Tin Phim */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "primary.light",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          pb: 1,
                        }}
                      >
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

                    {/* Thông Tin Vé */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "primary.light",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          pb: 1,
                        }}
                      >
                        Thông Tin Vé
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Ghế:</strong> {seats.join(", ")}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Giá:</strong>{" "}
                        {price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                          color: "#ffc107",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          mt: 1,
                        }}
                      >
                        <strong>Tổng cộng:</strong>{" "}
                        {total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider
                    sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }}
                  />

                  {/* Customer Information */}
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "primary.light",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        pb: 1,
                      }}
                    >
                      Thông Tin Khách Hàng
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" gutterBottom>
                          <strong>Họ tên:</strong> {fullName}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Email:</strong> {email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" gutterBottom>
                          <strong>CMND:</strong> {idNumber}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          <strong>Số điện thoại:</strong> {phone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleHome}
                    startIcon={<HomeIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      background:
                        "linear-gradient(45deg, #1a237e 0%, #3949ab 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #283593 0%, #5c6bc0 100%)",
                      },
                    }}
                  >
                    Về Trang Chủ
                  </Button>
                </Box>
              </Grid>
            </Grid>
            {/* Success Message */}
            {/* Success Message - Compact Version */}
            {paymentStatus === "success" ? (
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 2,
                  px: 3,
                  backgroundColor: "rgba(46, 125, 50, 0.15)",
                  borderLeft: "4px solid #4caf50",
                  borderRadius: 1,
                  mb: 3,
                  maxWidth: { xs: "100%", md: "80%" },
                  mx: "auto",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "radial-gradient(circle at top right, rgba(76, 175, 80, 0.15), transparent 70%)",
                    zIndex: 0,
                  },
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{
                    fontSize: 40,
                    mr: 2,
                    color: "#4caf50",
                    filter: "drop-shadow(0 0 6px rgba(76, 175, 80, 0.4))",
                    zIndex: 1,
                  }}
                />
                <Box sx={{ flex: 1, zIndex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom={false}
                    fontFamily={"JetBrains Mono"}
                    sx={{ mb: 0.5 }}
                    color="primary.light"
                  >
                    Đặt Vé Thành Công!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Cảm ơn bạn đã đặt vé. Vui lòng kiểm tra email để xem thông
                    tin vé.
                  </Typography>
                </Box>
              </Paper>
            ) : (
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 2,
                  px: 3,
                  backgroundColor: "rgba(255, 0, 0, 0.15)",
                  borderLeft: "4px solid #f44336",
                  borderRadius: 1,
                  mb: 3,
                  maxWidth: { xs: "100%", md: "80%" },
                  mx: "auto",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "radial-gradient(circle at top right, rgba(255, 0, 0, 0.15), transparent 70%)",
                    zIndex: 0,
                  },
                }}
              >
                <CancelOutlined
                  sx={{
                    fontSize: 40,
                    mr: 2,
                    color: "#f44336",
                    filter: "drop-shadow(0 0 6px rgba(255, 0, 0, 0.4))",
                    zIndex: 1,
                  }}
                />
                <Box sx={{ flex: 1, zIndex: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom={false}
                    fontFamily={"JetBrains Mono"}
                    sx={{ mb: 0.5 }}
                    color="primary.light"
                  >
                    Đặt vé thất bại!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Giao dịch đã bị hủy. Nếu cần hỗ trợ, 
                    vui lòng liên hệ với chúng tôi.
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Confirmation;
