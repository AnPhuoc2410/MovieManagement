import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { useSignalR } from "../../contexts/SignalRContext";

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { connection, isConnected } = useSignalR();

  // Retrieve showtime details from location state or fallback to defaults
  const {
    selectedTime = "Not selected",
    selectedDate = "Not selected",
    tickets = [],
    seats = [] as string[],
    showTimeId = "",
    selectedSeatsInfo = [],
    movieTitle = "Phim Mặc Định",
    screen = "Màn hình 1",
  } = location.state || {};

  // Determine effective showTimeId from state or session storage
  const effectiveShowTimeId =
    showTimeId || sessionStorage.getItem("currentShowTimeId") || "";

  // Handle page refresh or navigation without confirmation:
  // (For instance, you might want to release pending seats if the page is refreshed)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (connection && isConnected && effectiveShowTimeId && selectedSeatsInfo?.length) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [connection, isConnected, effectiveShowTimeId, selectedSeatsInfo]);

  // Calculate total ticket price
  const totalPrice = (tickets || []).reduce(
    (sum: number, t: any) => sum + t.price * (t.quantity || 0),
    0
  );
  const total = totalPrice;

  // Additional info with defaults
  const showDate = selectedDate;
  const showTime = selectedTime;
  const price = totalPrice;

  // Customer form fields and error states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");

  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [idNumberError, setIdNumberError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleConfirm = async () => {
    let hasError = false;
    if (!fullName.trim()) {
      setFullNameError(true);
      hasError = true;
    } else {
      setFullNameError(false);
    }
    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }
    if (!idNumber.trim()) {
      setIdNumberError(true);
      hasError = true;
    } else {
      setIdNumberError(false);
    }
    if (!phone.trim()) {
      setPhoneError(true);
      hasError = true;
    } else {
      setPhoneError(false);
    }
    if (hasError) return;

    try {
      const data = {
        totalTicket: tickets.length,
        amount: total,
      };

      const response = await api.post(
        `vnpay/createpaymenturl?money=${total}&description=${encodeURIComponent(
          `Payment for movie tickets: ${movieTitle}`
        )}&userId=${"e5c69f1e-c731-420f-badb-723f897e8819"}`,
        data
      );

      // Save booking info to session storage so you can retrieve it later if needed.
      sessionStorage.setItem(
        "bookingInfo",
        JSON.stringify({
          selectedTime,
          selectedDate,
          tickets,
          seats,
          price,
          total,
          fullName,
          email,
          idNumber,
          phone,
          showTimeId: effectiveShowTimeId,
          selectedSeatsInfo,
        })
      );

      // Redirect to VNPay payment URL
      window.location.href = response.data;
    } catch (error) {
      console.error(error);
      toast.error("Đặt vé thất bại!");
      return;
    }
  };

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
            <StepTracker currentStep={3} />
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
              <StepTracker currentStep={3} />
            </Box>

            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              gutterBottom
              fontFamily={"JetBrains Mono"}
              sx={{ textTransform: "uppercase", mb: 4 }}
            >
              Thanh Toán Vé
            </Typography>

            {/* Payment content */}
            <Grid container spacing={4}>
              {/* Left Column: Movie Poster */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(28, 28, 28, 0.8)",
                    color: "white",
                  }}
                >
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

              {/* Right Column: Movie/Ticket Info & Customer Form */}
              <Grid item xs={12} md={8}>
                {/* Combined Movie & Ticket Info */}
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(28, 28, 28, 0.8)",
                    color: "white",
                    mb: 3,
                  }}
                >
                  <Grid container spacing={3}>
                    {/* Thông Tin Phim */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom>
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
                      <Typography variant="h6" gutterBottom>
                        Thông Tin Vé
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Ghế:</strong> {seats.join(", ") || "Chưa chọn ghế"}
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
                          color: "#fbc02d",
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
                </Paper>

                {/* Customer Information Form */}
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(28, 28, 28, 0.8)",
                    color: "white",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Thông Tin Khách Hàng
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Họ tên"
                        variant="outlined"
                        fullWidth
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={fullNameError}
                        helperText={fullNameError ? "Vui lòng nhập họ tên" : ""}
                        InputLabelProps={{ style: { color: "white" } }}
                        sx={{ input: { color: "white" } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                        helperText={emailError ? "Vui lòng nhập email" : ""}
                        InputLabelProps={{ style: { color: "white" } }}
                        sx={{ input: { color: "white" } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="CMND"
                        variant="outlined"
                        fullWidth
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        error={idNumberError}
                        helperText={idNumberError ? "Vui lòng nhập CMND" : ""}
                        InputLabelProps={{ style: { color: "white" } }}
                        sx={{ input: { color: "white" } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Số điện thoại"
                        variant="outlined"
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={phoneError}
                        helperText={phoneError ? "Vui lòng nhập số điện thoại" : ""}
                        InputLabelProps={{ style: { color: "white" } }}
                        sx={{ input: { color: "white" } }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleConfirm}
                      sx={{
                        px: 4,
                        py: 1,
                        fontSize: "1rem",
                        borderRadius: 2,
                      }}
                    >
                      Xác nhận đặt vé
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Payment;
