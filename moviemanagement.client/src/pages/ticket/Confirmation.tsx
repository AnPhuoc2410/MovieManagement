import React from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";

const Confirmation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract data from location.state (with defaults)
    const { selectedTime, selectedDate } = location.state || {
        selectedTime: "Not selected",
        selectedDate: "Not selected",
    };

    const {
        movieTitle = "Phim Mặc Định",
        screen = "Màn hình 1",
        showDate = selectedDate,
        showTime = selectedTime,
        seats = [] as string[],
        price = 100000, // Price per seat in VND
        fullName = "",
        email = "",
        idNumber = "",
        phone = "",
    } = location.state || {};

    // Calculate total price
    const total = seats.length * price;

    const handleHome = () => {
        navigate("/");
    };

    return (
        <>
            {/* StepTracker as the fixed header */}
            <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
                {/* On Confirmation page, we're at step 4 */}
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
                <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                    Thông Tin Đặt Vé
                </Typography>

                <Grid container spacing={4} sx={{ px: { xs: 2, sm: 5 } }}>
                    {/* Left Column */}
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
                                    maxHeight: 500, // Cap the poster height
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

                    {/* Right Column */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, backgroundColor: "#1c1c1c", color: "white" }}>
                            {/* Booking Details */}
                            <Typography variant="h6" gutterBottom>
                                Thông Tin Vé
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                        <strong>Ghế:</strong> {seats.join(", ")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
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

                            {/* Customer Information */}
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Thông Tin Khách Hàng
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            <strong>Họ tên:</strong> {fullName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1">
                                            <strong>Email:</strong> {email}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">
                                            <strong>CMND:</strong> {idNumber}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1">
                                            <strong>Số điện thoại:</strong> {phone}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleHome}>
                        Về trang chủ
                    </Button>
                </Box>
            </Container>
            <Footer />
        </>
    );
};

export default Confirmation;
