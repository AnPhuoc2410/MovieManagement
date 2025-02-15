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
import Header from "../../components/home/Header";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // First, extract selectedTime and selectedDate from location.state
  const { selectedTime, selectedDate } = location.state || { 
    selectedTime: "Not selected", 
    selectedDate: "Not selected" 
  };

  // Then, extract other values with defaults.
  // For showDate and showTime, we use the selected values from above.
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

  // Form fields for customer information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");

  const handleConfirm = () => {
    alert("Đặt vé thành công!");
    navigate("/confirmation", {
      state: { movieTitle, screen, showDate, showTime, seats, total, fullName, email }
    });
  };

  return (
    <>
      <Header />
      {/* Sticky Step Tracker showing step 3 */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
        <StepTracker currentStep={3} />
      </Box>
      <Container
        maxWidth={false}
        sx={{
          py: 30,
          px: { xs: 0, sm: 3 },
          backgroundColor: "#0B0D1A",
          color: "white",
          minHeight: "50vh",
          m: 0
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Thanh Toán Vé
        </Typography>

        {/* Booking Details */}
        <Paper
          sx={{
            p: 3,
            backgroundColor: "#1c1c1c",
            mb: 3,
            color: "white"
          }}
        >
          <Typography variant="h6" gutterBottom>
            Thông Tin Vé
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography>
                <strong>Tên phim:</strong> {movieTitle}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Màn hình:</strong> {screen}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Ngày chiếu:</strong> {showDate}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Giờ chiếu:</strong> {showTime}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Ghế:</strong> {seats.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <strong>Giá:</strong> {price.toLocaleString()} VND
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ tên"
                variant="outlined"
                fullWidth
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
      </Container>
      <Footer />
    </>
  );
};

export default Payment;
