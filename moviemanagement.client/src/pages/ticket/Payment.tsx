import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControlLabel,
  RadioGroup,
  CircularProgress,
  Radio,
  Checkbox,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { useSignalR } from "../../contexts/SignalRContext";
import { SeatType } from "../../types/seattype.types";
import SeatCountdown from "../../components/Ticket/SeatCountdown";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userDetails } = useAuth();
  const { connection, isConnected } = useSignalR();
  const [promotions, setPromotions] = useState<any[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [isPromotionsLoading, setIsPromotionsLoading] = useState(false);

  const {
    movieId,
    selectedTime = "Not selected",
    selectedDate = "Not selected",
    tickets = [],
    seats = [] as string[],
    showTimeId = "",
    selectedSeatsInfo = [],
    movieData = null,
    roomName = "",
    lastSelectionTime,
    resetCounter = 0,
  } = location.state || {};


  const movieTitle = movieData?.movieName || t("payment.movie.default");
  const showDate = selectedDate;
  const showTime = selectedTime;

  // Determine effective showTimeId from state or session storage
  const effectiveShowTimeId =
    showTimeId || sessionStorage.getItem("currentShowTimeId") || "";

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (connection && isConnected && effectiveShowTimeId && selectedSeatsInfo?.length) {
        // Add warning
        e.preventDefault();
        e.returnValue = "";

        const userId = userDetails?.userId;
        const payload = JSON.stringify({
          ticketRequests: selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
            TicketId: seat.ticketId,
            Version: seat.version
          })),
          showtimeId: effectiveShowTimeId,
          userId
        });

        // Use beacon API to send the release request
        navigator.sendBeacon('/api/seats/release-pending', payload);

        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [connection, isConnected, effectiveShowTimeId, selectedSeatsInfo]);

  useEffect(() => {
    // Cleanup function runs when component unmounts
    return () => {
      if (connection && isConnected && selectedSeatsInfo?.length > 0) {
        const userId = userDetails?.userId;
        const ticketRequests = selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
          TicketId: seat.ticketId,
          Version: seat.version,
        }));

        connection.invoke("ReleasePendingSeats", ticketRequests, effectiveShowTimeId, userId)
          .catch(err => console.error("Failed to release seats on unmount:", err));
      }
    };
  }, [connection, isConnected, selectedSeatsInfo, effectiveShowTimeId]);

  const handleBack = async () => {
    if (connection && selectedSeatsInfo?.length > 0) {
      try {
        const userId = userDetails?.userId;
        const ticketRequests = selectedSeatsInfo.map((seat: { ticketId: any; version: any; }) => ({
          TicketId: seat.ticketId,
          Version: seat.version
        }));

        await connection.invoke("ReleasePendingSeats", ticketRequests, effectiveShowTimeId, userId);
        toast.success(t("toast.success.seat.cancel_booking"));
        navigate(-1);
      } catch (error) {
        console.error("Error releasing seats:", error);
        toast.error(t("toast.error.seat.cancel_booking"));
        // Navigate anyway as fallback
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      setIsPromotionsLoading(true);
      try {
        // Adjust the endpoint to match your actual API
        const response = await api.get('promotions');

        // Assuming the API returns the data directly or inside a data property
        const promotionsData = response.data.data || response.data || [];
        setPromotions(promotionsData);

        console.log("Loaded promotions:", promotionsData);
      } catch (error) {
        console.error("Failed to load promotions", error);
        toast.error(t("toast.error.promotion.loading"));
      } finally {
        setIsPromotionsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const calculateDiscountedTotal = useCallback((originalTotal: number) => {
    if (!selectedPromotion) return originalTotal;

    // Calculate discount based on percentage
    const discount = originalTotal * (selectedPromotion.discount / 100);

    // Return original price minus discount
    return Math.max(0, originalTotal - discount);
  }, [selectedPromotion]);

  // Update the total calculation
  const totalPrice = (tickets || []).reduce(
    (sum: number, t: any) => sum + t.price * (t.quantity || 0),
    0
  );
  const discountedTotal = calculateDiscountedTotal(totalPrice);
  const total = discountedTotal;

  // Customer form state and error flags
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
        promotionId: selectedPromotion?.promotionId || null,
        tickets: selectedSeatsInfo.map((seat: { ticketId: any; }) => seat.ticketId)
      };

      const response = await api.post(
        `vnpay/createpaymenturl?money=${total}&description=${encodeURIComponent(
          `Payment for movie tickets: ${movieData?.movieName}`
        )}&userId=${userDetails?.userId}`,
        data
      );

      // Save booking info to session storage for later retrieval.
      sessionStorage.setItem(
        "bookingInfo",
        JSON.stringify({
          selectedTime,
          selectedDate,
          tickets,
          seats,
          totalPrice,
          total,
          fullName,
          email,
          idNumber,
          phone,
          selectedSeatsInfo,
          lastSelectionTime,
          resetCounter,
          movieData,
          roomName,
          promotion: selectedPromotion,
        })
      );

      // Redirect to VNPay payment URL.
      window.location.href = response.data;
    } catch (error) {
      console.error(error);
      toast.error(t("toast.error.ticket.booking"));
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
          {/* StepTracker Sidebar (Desktop) */}
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
            {/* Countdown Timer Banner */}
            {lastSelectionTime && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(27, 38, 53, 0.8)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    align="center"
                    sx={{ mb: 1, color: "#fbc02d" }}
                  >
                    {t("payment.timer")}
                  </Typography>
                  <SeatCountdown
                    seatId="payment-timer"
                    seatName="Timer"
                    startTime={lastSelectionTime}
                    resetTrigger={resetCounter}
                    onTimeout={() => {
                      toast.error(t("toast.error.seat.remainder"));
                      navigate(`/ticket/${movieId}`, { replace: true });
                    }}
                  />
                </Paper>
              </Box>
            )}
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
            {/* StepTracker (Mobile) */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              {/* Countdown Timer Banner */}
              {lastSelectionTime && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(27, 38, 53, 0.8)",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{ mb: 1, color: "#fbc02d" }}
                    >
                      {t("payment.timer")}
                    </Typography>
                    <SeatCountdown
                      seatId="payment-timer"
                      seatName="Timer"
                      startTime={lastSelectionTime}
                      resetTrigger={resetCounter}
                      onTimeout={() => {
                        toast.error(t("toast.error.seat.remainder"));
                        navigate(`/ticket/${movieId}`, { replace: true });
                      }}
                    />
                  </Paper>
                </Box>
              )}
              <StepTracker currentStep={3} />
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
              {t("payment.ticket.payment")}
            </Typography>

            {/* Payment Info and Form */}
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
                    src={movieData?.image}
                    alt={movieData?.movieName || t("payment.movie.poster")}
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

              {/* Right Column: Ticket Info & Customer Form */}
              <Grid item xs={12} md={8}>
                {/* Movie & Ticket Information */}
                <Paper
                  sx={{
                    p: { xs: 3, md: 4 },
                    backgroundColor: "rgba(28, 28, 28, 0.8)",
                    color: "white",
                    mb: { xs: 3, md: 4 },
                  }}
                >
                  <Grid container spacing={3}>
                    {/* Movie Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
                      >
                        {t("payment.movie.description")}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                      >
                        <strong>{t("payment.movie.name")}</strong> {movieTitle}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                      >
                        <strong>{t("payment.movie.room")}</strong> {roomName}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                      >
                        <strong>{t("payment.showtime.day")}</strong> {showDate}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                      >
                        <strong>{t("payment.showtime.hour")}</strong> {showTime}
                      </Typography>
                    </Grid>

                    {/* Ticket Details */}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
                      >
                        {t("payment.ticket.infor")}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                      >
                        <strong>{t("payment.ticket.seat")}</strong> {seats.join(", ") || "Chưa chọn ghế"}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                      >
                        <strong>{t("payment.ticket.price")}</strong>{" "}
                        {totalPrice.toLocaleString("vi-VN", {
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
                          fontSize: { xs: "1.2rem", md: "1.4rem" },
                          mt: 1,
                        }}
                      >
                        <strong>{t("payment.total_amount")}</strong>{" "}
                        {total.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                        {selectedPromotion && (
                          <Typography
                            component="span"
                            sx={{ color: "#4caf50", ml: 1, fontSize: { xs: "1rem", md: "1.1rem" } }}
                          >
                            ({t("payment.promotion.used")})
                          </Typography>
                        )}
                      </Typography>

                      {/* Promotions Section */}
                      <Paper
                        sx={{
                          p: { xs: 2, md: 3 },
                          backgroundColor: "rgba(28, 28, 28, 0.8)",
                          color: "white",
                          mb: { xs: 3, md: 4 },
                        }}
                      >
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
                        >
                          {t("payment.promotion.title")}
                        </Typography>

                        {isPromotionsLoading ? (
                          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                            <CircularProgress size={28} sx={{ color: "#fbc02d" }} />
                          </Box>
                        ) : promotions.length === 0 ? (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic", fontSize: { xs: "1rem", md: "1.1rem" } }}
                          >
                            {t("payment.promotion.notfound")}
                          </Typography>
                        ) : (
                          <Box
                            sx={{
                              maxHeight: "250px",
                              overflowY: "auto",
                              pr: 1,
                              "&::-webkit-scrollbar": { width: "8px" },
                              "&::-webkit-scrollbar-track": {
                                background: "rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "rgba(255,255,255,0.2)",
                                borderRadius: "4px",
                                "&:hover": { background: "rgba(255,255,255,0.3)" },
                              },
                            }}
                          >
                            {promotions.map((promo) => {
                              // Check if the promotion is outdated
                              const isOutdated = new Date(promo.toDate) < new Date();
                              // Determine if this promotion is currently selected
                              const isSelected = selectedPromotion?.promotionId === promo.promotionId;

                              return (
                                <FormControlLabel
                                  key={promo.promotionId}
                                  disabled={isOutdated}
                                  control={
                                    <Checkbox
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          // Only allow selection if the promotion is not outdated
                                          if (!isOutdated) {
                                            setSelectedPromotion(promo);
                                          }
                                        } else {
                                          // Deselect if unchecked
                                          setSelectedPromotion(null);
                                        }
                                      }}
                                      sx={{
                                        color: isOutdated ? "grey" : "white",
                                        "&.Mui-checked": { color: "#fbc02d" },
                                      }}
                                    />
                                  }
                                  label={
                                    <Box
                                      sx={{
                                        backgroundColor: isOutdated ? "rgba(0,0,0,0.2)" : "transparent",
                                        p: 1,
                                        borderRadius: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                                      >
                                        {promo.promotionName}
                                      </Typography>
                                      <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                                        {promo.image && (
                                          <Box
                                            component="img"
                                            src={promo.image}
                                            sx={{
                                              width: 80,
                                              height: 50,
                                              objectFit: "cover",
                                              borderRadius: 1,
                                            }}
                                          />
                                        )}
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: isOutdated ? "grey" : "#fbc02d",
                                            fontSize: { xs: "1rem", md: "1.1rem" },
                                          }}
                                        >
                                          {t("payment.promotion.discount")} {promo.discount}%
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: isOutdated ? "grey" : "#bdbdbd",
                                          fontSize: { xs: "0.9rem", md: "1rem" },
                                        }}
                                      >
                                        {t("payment.promotion.from")}{" "}
                                        {new Date(promo.fromDate).toLocaleDateString("vi-VN")} {t("payment.promotion.to")}{" "}
                                        {new Date(promo.toDate).toLocaleDateString("vi-VN")}
                                      </Typography>
                                    </Box>
                                  }
                                  sx={{
                                    mb: 2,
                                    alignItems: "flex-start",
                                    opacity: isOutdated ? 0.5 : 1,
                                  }}
                                />
                              );
                            })}
                          </Box>
                        )}
                        {/* Display discount amount if promotion selected */}
                        {selectedPromotion && (
                          <Box sx={{ mt: 2, borderTop: "1px solid rgba(255,255,255,0.1)", pt: 2 }}>
                            <Typography
                              variant="body1"
                              sx={{ fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                            >
                              <strong>{t("payment.origin_price")}</strong>{" "}
                              {totalPrice.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ color: "#4caf50", fontSize: { xs: "1.1rem", md: "1.3rem" } }}
                            >
                              <strong>{t("payment.promotion.discount")} ({selectedPromotion.discount}%):</strong>{" "}
                              {(totalPrice - discountedTotal).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Customer Information Form */}
                <Paper
                  sx={{
                    p: { xs: 3, md: 4 },
                    backgroundColor: "rgba(28, 28, 28, 0.8)",
                    color: "white",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
                  >
                    {t("payment.user_infor")}
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={t("common.table_header.user.fullname")}
                        variant="outlined"
                        fullWidth
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={fullNameError}
                        helperText={fullNameError ? t("helperText.error.fullname") : ""}
                        sx={{
                          maxWidth: "400px",
                          input: { color: "white", fontSize: { xs: "1.1rem", md: "1.2rem" } },
                          "& label": { color: "rgba(255,255,255,0.7)", fontSize: { xs: "1.1rem", md: "1.2rem" } },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover fieldset": { borderColor: "white" },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={t("common.table_header.user.email")}
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                        helperText={emailError ? t("helperText.error.email") : ""}
                        sx={{
                          maxWidth: "400px",
                          input: { color: "white", fontSize: { xs: "1.1rem", md: "1.2rem" } },
                          "& label": { color: "rgba(255,255,255,0.7)", fontSize: { xs: "1.1rem", md: "1.2rem" } },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover fieldset": { borderColor: "white" },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={t("auth.signup.fields.id_card")}
                        variant="outlined"
                        fullWidth
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        error={idNumberError}
                        helperText={idNumberError ? t("helperText.error.id_number") : ""}
                        sx={{
                          maxWidth: "400px",
                          input: { color: "white", fontSize: { xs: "1.1rem", md: "1.2rem" } },
                          "& label": { color: "rgba(255,255,255,0.7)", fontSize: { xs: "1.1rem", md: "1.2rem" } },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover fieldset": { borderColor: "white" },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={t("common.table_header.user.phone")}
                        variant="outlined"
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={phoneError}
                        helperText={phoneError ? t("helperText.error.phone") : ""}
                        sx={{
                          maxWidth: "400px",
                          input: { color: "white", fontSize: { xs: "1.1rem", md: "1.2rem" } },
                          "& label": { color: "rgba(255,255,255,0.7)", fontSize: { xs: "1.1rem", md: "1.2rem" } },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover fieldset": { borderColor: "white" },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      sx={{
                        color: "#fbc02d",
                        borderColor: "#fbc02d",
                        mr: 2,
                        px: 4,
                        py: 1.2,
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "#ff9800",
                          backgroundColor: "rgba(251, 192, 45, 0.1)"
                        }
                      }}
                    >
                      {t("payment.back")}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleConfirm}
                      sx={{
                        background: "linear-gradient(135deg, #fbc02d 0%, #ff9800 100%)",
                        color: "#121212",
                        px: 4,
                        py: 1.2,
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        borderRadius: 2,
                        "&:hover": {
                          background: "linear-gradient(135deg, #ff9800 0%, #fbc02d 100%)",
                        },
                      }}
                    >
                      {t("payment.confirm")}
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
