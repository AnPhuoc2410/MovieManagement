import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignalR } from "../../contexts/SignalRContext";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CancelOutlined } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failure">();
  const { connection, joinGroup, leaveGroup, isConnected } = useSignalR();
  const [seatsUpdated, setSeatsUpdated] = useState(false);

  // Extract query param from VNPay redirection
  const queryParams = new URLSearchParams(location.search);
  const isSuccess = queryParams.get("isSuccess") === "true";

  // Extract booking info from session storage
  const bookingInfo = JSON.parse(sessionStorage.getItem("bookingInfo") || "{}");
  const showTimeId = sessionStorage.getItem("currentShowTimeId") || "";


  const {
    selectedTime = "Not selected",
    selectedDate = "Not selected",
    movieData = null,
    roomName = "",
    seats = [] as string[],
    totalPrice = 100000,
    total = totalPrice, // Default to totalPrice, don't recalculate
    promotion = null,
    fullName = "",
    email = "",
    idNumber = "",
    phone = "",
    selectedSeatsInfo = [],
    movieId,
  } = bookingInfo;

  const movieTitle = movieData?.movieName || "Phim Mặc Định";
  const showDate = selectedDate;
  const showTime = selectedTime;

  // Navigation handlers
  const handleHome = () => {
    navigate("/");
  };

  const handleBackToTicket = () => {
    if (movieId) {
      navigate(`/ticket/${movieId}`, { replace: true });
    } else {
      navigate("/movies/now-showing", { replace: true });
    }
  };

  // Display a spinner until the SignalR connection is ready
  const [isConnectionReady, setIsConnectionReady] = useState(isConnected);
  useEffect(() => {
    setIsConnectionReady(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (isSuccess) {
      console.log("Payment successful!");
      setPaymentStatus("success");
      toast.success("Ghế đã được đặt thành công!");
    } else {
      console.log("Payment failed or not completed.");
      setPaymentStatus("failure");
      toast.error("Đặt ghế không thành công!");
    }
  }, [isSuccess]);

  // Rejoin the SignalR group and update seat statuses
  useEffect(() => {
    if (!isConnected || !showTimeId || !connection) {
      console.log("Waiting for SignalR connection or missing showTimeId...");
      return;
    }
    const userId = userDetails?.userId;

    // First join the SignalR group
    joinGroup(showTimeId)
      .then(() => {
        console.log(`Confirmation page joined ShowTime group: ${showTimeId}`);

        const seatsToConfirm = selectedSeatsInfo?.length > 0
          ? selectedSeatsInfo
          : JSON.parse(sessionStorage.getItem("selectedSeats") || "[]");

        // If payment was successful and we haven't updated the seats yet
        if (isSuccess && !seatsUpdated) {
          // Get selected seats from sessionStorage if they don't exist in the state
          if (seatsToConfirm?.length > 0) {
            // Format the seats for the server
            const ticketRequests = seatsToConfirm.map((seat: { ticketId: any; version: any; }) => ({
              TicketId: seat.ticketId,
              Version: seat.version
            }));

            console.log("Attempting to confirm seat purchase:", ticketRequests);

            // Call the SignalR method
            connection.invoke("ConfirmSeatPurchase", ticketRequests, showTimeId, userId)
              .then(() => {
                console.log("Seats marked as purchased:", ticketRequests);
                setSeatsUpdated(true);
              })
              .catch((error) => {
                console.error("Error finalizing seat purchase:", error);
                toast.error("Không thể cập nhật trạng thái ghế: " + error.message);
              });
          } else {
            console.error("No seats to confirm purchase for!");
            toast.error("Không tìm thấy thông tin ghế để xác nhận!");
          }
        } else if (!isSuccess && selectedSeatsInfo?.length) {
          // Handle the failed payment case as before
          const ticketRequests = seatsToConfirm.map((seat: { ticketId: any; version: any; }) => ({
            TicketId: seat.ticketId,
            Version: seat.version
          }));
          connection.invoke("ReleasePendingSeats", ticketRequests, showTimeId, userId)
            .then(() => console.log("Seats released due to payment failure"))
            .catch((err) => console.error("Error releasing seats:", err));
        }
      })
      .catch((err) => console.error("Error joining ShowTime group:", err));

    return () => {
      if (isConnected && showTimeId) {
        leaveGroup(showTimeId)
          .then(() => console.log(`Confirmation page left ShowTime group: ${showTimeId}`))
          .catch((err) => console.error("Error leaving ShowTime group:", err));
      }
    };
  }, [isConnected, showTimeId, connection, isSuccess, selectedSeatsInfo, seatsUpdated, joinGroup, leaveGroup]);

  if (!isConnectionReady) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0D1A",
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2, color: "white" }}>
          Đang kết nối đến máy chủ...
        </Typography>
      </Box>
    );
  }

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
          {/* Sidebar StepTracker (Desktop) */}
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
            {/* Mobile StepTracker */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              <StepTracker currentStep={4} paymentStatus={paymentStatus} />
            </Box>

            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              gutterBottom
              fontFamily={"JetBrains Mono"}
              sx={{
                textTransform: "uppercase",
                mb: 2,
                letterSpacing: "1.2px",
                lineHeight: "1.5",
              }}
            >
              Thông Tin Đặt Vé
            </Typography>

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
                    src={movieData?.image}
                    alt={movieData?.movieName}
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

                  <Grid container spacing={3}>
                    {/* Movie Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "primary.light",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          pb: 1,
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          mb: 2,
                        }}
                      >
                        Thông Tin Phim
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Tên phim:</strong> {movieTitle}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Phòng Chiếu:</strong> {roomName}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Ngày chiếu:</strong> {showDate}
                      </Typography>
                    </Grid>
                    {/* Ticket Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "primary.light",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          pb: 1,
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          mb: 2,
                        }}
                      >
                        Thông Tin Vé
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontSize: "1.1rem", mb: 1 }}>
                        <strong>Ghế:</strong> {seats.join(", ")}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Giờ chiếu:</strong> {showTime}
                      </Typography>
                    </Grid>

                    {/* Promotion Details */}
                    <Grid item xs={12} >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          color: "primary.light",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          pb: 1,
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          mb: 2,
                        }}
                      >
                        Khuyến Mãi
                      </Typography>
                      {promotion && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          {promotion.image && (
                            <Box
                              component="img"
                              src={promotion.image}
                              alt={promotion.promotionName}
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: "contain",
                                borderRadius: 1,
                              }}
                            />
                          )}
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#4caf50",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                                mb: 1,
                              }}
                            >
                              {promotion.promotionName}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 1 }}>
                              <strong>Giá gốc:</strong>{" "}
                              {totalPrice.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#4caf50", fontSize: "1.1rem" }}>
                              <strong>Tiết kiệm:</strong>{" "}
                              {(totalPrice - total).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                          color: "#ffc107",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          mt: 2,
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

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    mt: 4,
                  }}
                >
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
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleBackToTicket}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      borderColor: "#90caf9",
                      color: "#90caf9",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      "&:hover": {
                        background: "rgba(144, 202, 249, 0.1)",
                      },
                    }}
                  >
                    Quay lại Đặt Vé
                  </Button>
                </Box>
              </Grid>
            </Grid>
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
                    Cảm ơn bạn đã đặt vé. Vui lòng kiểm tra email để xem thông tin vé.
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
                    Giao dịch đã bị hủy. Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi.
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
