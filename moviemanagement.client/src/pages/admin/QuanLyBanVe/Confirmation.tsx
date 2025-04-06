import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Stack,
  CssBaseline,
  Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignalR } from "../../../contexts/SignalRContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CancelOutlined } from "@mui/icons-material";
import toast from "react-hot-toast";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userDetails } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failure">("success"); // Default to success for admin
  const { connection, joinGroup, leaveGroup, isConnected } = useSignalR();
  const [seatsUpdated, setSeatsUpdated] = useState(false);
  const [disableCustomTheme] = useState<boolean>(false);

  const {
    selectedTime = "Not selected",
    selectedDate = "Not selected",
    tickets = [],
    seats = [] as string[],
    showTimeId = "",
    selectedSeatsInfo = [],
    movieData = null,
    roomName = "",
    totalPrice = 0,
    selectedUser = null,
    paymentMethod = "money",
  } = location.state || {};

  const movieTitle = movieData?.movieName || t("payment.movie.default");
  const showDate = selectedDate;
  const showTime = selectedTime;
  const effectiveShowTimeId = showTimeId || "";

  // Navigate back to ticket selection screen
  const handleBackToTickets = () => {
    navigate('/admin/ql-ban-ve');
  };

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  // Display loading spinner while establishing SignalR connection
  const [isConnectionReady, setIsConnectionReady] = useState(isConnected);
  useEffect(() => {
    setIsConnectionReady(isConnected);
  }, [isConnected]);

  // SignalR seat confirmation logic
  useEffect(() => {
    if (!isConnected || !effectiveShowTimeId || !connection) {
      console.log("Waiting for SignalR connection or missing showTimeId...");
      return;
    }

    const userId = userDetails?.userId;

    // Join the SignalR group
    joinGroup(effectiveShowTimeId)
      .then(() => {
        console.log(`Admin confirmation joined ShowTime group: ${effectiveShowTimeId}`);

        // Only update seats if they haven't been updated yet
        if (!seatsUpdated && selectedSeatsInfo?.length > 0) {
          // Format the seats for the server
          const ticketRequests = selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
            TicketId: seat.ticketId,
            Version: seat.version
          }));

          console.log("Confirming seat purchase:", ticketRequests);

          // Call the SignalR method to confirm purchase
          connection.invoke("ConfirmSeatPurchase", ticketRequests, effectiveShowTimeId, userId)
            .then(() => {
              console.log("Seats marked as purchased:", ticketRequests);
              setSeatsUpdated(true);
              toast.success(t("toast.success.seat.booking"));
            })
            .catch((error) => {
              console.error("Error finalizing seat purchase:", error);
              toast.error(t("toast.error.seat.update_status") + error.message);
              setPaymentStatus("failure");
            });
        }
      })
      .catch((err) => console.error("Error joining ShowTime group:", err));

    return () => {
      if (isConnected && effectiveShowTimeId) {
        leaveGroup(effectiveShowTimeId)
          .then(() => console.log(`Admin confirmation left ShowTime group: ${effectiveShowTimeId}`))
          .catch((err) => console.error("Error leaving ShowTime group:", err));
      }
    };
  }, [isConnected, effectiveShowTimeId, connection, selectedSeatsInfo, seatsUpdated, joinGroup, leaveGroup]);

  if (!isConnectionReady) {
    return (
      <AppTheme disableCustomTheme={disableCustomTheme}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: "flex", height: "100vh" }}>
          <SideMenu />
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <AppNavbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="primary" />
              <Typography sx={{ ml: 2 }}>
                {t("admin.ticket_management.connecting")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </AppTheme>
    );
  }

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
            <Stack spacing={3}>
              <Header />
              <Paper
                elevation={2}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {/* Title */}
                <Box
                  sx={{
                    p: 3,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    Xác Nhận Đặt Vé
                  </Typography>
                </Box>

                {/* Payment Status Alert */}
                {paymentStatus === "success" ? (
                  <Alert
                    severity="success"
                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                    sx={{ mx: 3, mt: 3 }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t("admin.ticket_management.booking_success")}
                    </Typography>
                    <Typography variant="body2">
                      {t("admin.ticket_management.save_to_system")}
                    </Typography>
                  </Alert>
                ) : (
                  <Alert
                    severity="error"
                    icon={<CancelOutlined fontSize="inherit" />}
                    sx={{ mx: 3, mt: 3 }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t("admin.ticket_management.booking_faild")}
                    </Typography>
                    <Typography variant="body2">
                      {t("admin.ticket_management.error")}
                    </Typography>
                  </Alert>
                )}

                {/* Main Content */}
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Left Column: Movie Info */}
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          component="img"
                          src={movieData?.image}
                          alt={movieData?.movieName || t("payment.movie.poster")}
                          sx={{
                            width: "100%",
                            borderRadius: 2,
                            objectFit: "contain",
                            maxHeight: 400,
                            mb: 2,
                          }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {movieTitle}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body1" gutterBottom>
                            <strong>{t("payment.movie.room")}</strong> {roomName}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>{t("payment.showtime.day")}</strong> {showDate}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>{t("payment.showtime.hour")}</strong> {showTime}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>{t("payment.ticket.seat")}</strong>{" "}
                            {seats.join(", ") || "Chưa chọn ghế"}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Right Column: Booking Details */}
                    <Grid item xs={12} md={8}>
                      {/* Customer Information Section */}
                      {selectedUser && (
                        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Thông Tin Khách Hàng
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body1" gutterBottom>
                                <strong>{t("payment.user_infor")}</strong> {selectedUser.userName}
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                <strong>{t("auth.signup.fields.email")}</strong> {selectedUser.email}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body1" gutterBottom>
                                <strong>{t("auth.signup.fields.id_card")}</strong> {selectedUser.idCard}
                              </Typography>
                              <Typography variant="body1" gutterBottom>
                                <strong>{t("auth.signup.fields.phone")}</strong> {selectedUser.phoneNumber}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body1">
                              <strong>{t("admin.ticket_management.current_point")}</strong> {selectedUser.point}
                            </Typography>
                            <Typography variant="body1">
                              <strong>{t("admin.ticket_management.payment_method")}</strong> {paymentMethod === "money" ? "Tiền mặt" : "Sử dụng điểm"}
                            </Typography>
                          </Box>
                        </Paper>
                      )}

                      {/* Payment Details */}
                      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          {t("admin.ticket_management.payment_detail")}
                        </Typography>

                        {tickets.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              {t("admin.ticket_management.ticket_bought")}
                            </Typography>
                            {tickets.map((ticket: any, index: number) => (
                              <Box
                                key={index}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  mb: 1
                                }}
                              >
                                <Typography>
                                  {ticket.name} x{ticket.quantity}
                                </Typography>
                                <Typography>
                                  {(ticket.price * ticket.quantity).toLocaleString('vi-VN')}đ
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="h6">{t("admin.ticket_management.amount")}</Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {totalPrice.toLocaleString('vi-VN')}đ
                          </Typography>
                        </Box>
                      </Paper>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<ArrowBackIcon />}
                          onClick={handleBackToTickets}
                        >
                          {t("admin.ticket_management.back")}
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<HomeIcon />}
                          onClick={handleBackToDashboard}
                        >
                          {t("admin.ticket_management.come_to_dashboard")}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Confirmation;
