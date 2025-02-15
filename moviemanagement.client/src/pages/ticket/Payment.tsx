import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract selectedTime and selectedDate from location.state
  const { selectedTime, selectedDate } = location.state || {
    selectedTime: "Not selected",
    selectedDate: "Not selected"
  };

  // Extract additional booking details (with defaults)
  const {
    movieTitle = "Phim Mặc Định",
    screen = "Màn hình 1",
    showDate = selectedDate,
    showTime = selectedTime,
    seats = [] as string[],
    price = 100000 // Price per seat in VND
  } = location.state || {};

  // Calculate total price
  const total = seats.length * price;

  // Customer form fields and error states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");

  const [fullNameError, setFullNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [idNumberError, setIdNumberError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const handleConfirm = () => {
    // Basic validation: ensure all fields are filled.
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

    alert("Đặt vé thành công!");
    navigate("/confirmation", {
      state: {
        movieTitle,
        screen,
        showDate,
        showTime,
        seats,
        total,
        fullName,
        email,
        idNumber,
        phone
      }
    });
  };

  return (
    <>
      {/* Fixed StepTracker Header */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
        <StepTracker currentStep={3} />
      </Box>

      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          py: 15,
          px: { xs: 0, sm: 3 },
          backgroundColor: "#0B0D1A",
          color: "white",
          minHeight: "50vh"
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Thanh Toán Vé
        </Typography>

        <Grid container spacing={4} sx={{ px: { xs: 2, sm: 5 } }}>
          {/* Left Column: Movie Image & Details */}
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
              <Typography variant="h6" gutterBottom>
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
            </Paper>
          </Grid>

          {/* Right Column: Booking Details & Customer Form */}
          <Grid item xs={12} md={8}>
            {/* Booking Details */}
            <Paper sx={{ p: 3, backgroundColor: "#1c1c1c", color: "white", mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thông Tin Vé
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Ghế:</strong> {seats.join(", ")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Giá:</strong> {price.toLocaleString()} VND
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Tổng cộng:</strong> {total.toLocaleString()} VND
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Customer Information Form */}
            <Paper sx={{ p: 3, backgroundColor: "#1c1c1c", color: "white" }}>
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
                <Button variant="contained" color="primary" onClick={handleConfirm}>
                  Xác nhận đặt vé
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Payment;
