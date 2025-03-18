import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SeatCinema from "../../components/Ticket/SeatCinema";
import StepTracker from "../../components/Ticket/StepTracker";
import SeatCountdown from "../../components/Ticket/SeatCountdown";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const { showTimeId, selectedTime, selectedDate, tickets } = location.state || {
    showTimeId: "",
    selectedTime: "Not selected",
    selectedDate: "Not selected",
    tickets: [],
  };

  // State to store selected seats
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; name: string; version: string; ticketId: string; isMine?: boolean; selectedAt?: number }[]
  >([]);

  // Single timestamp for all seat selections
  const [lastSelectionTime, setLastSelectionTime] = useState<number | null>(null);

  // Ensure we have a consistent user ID for seat selection
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", Math.random().toString(36).substring(2, 15));
    }
  }, []);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7119/seatHub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR");

        // Join the specific showTime group after connection is established
        if (showTimeId) {
          newConnection.invoke("JoinShowTime", showTimeId)
            .then(() => console.log(`Joined ShowTime group: ${showTimeId}`))
            .catch(err => console.error("Error joining ShowTime group:", err));
        }
      })
      .catch((err) => console.error("SignalR Connection Error:", err));

    return () => {
      // Leave the group before disconnecting
      if (newConnection.state === "Connected" && showTimeId) {
        newConnection.invoke("LeaveShowTime", showTimeId)
          .catch(err => console.error("Error leaving ShowTime group:", err));
      }
      newConnection.stop();
    };
  }, [showTimeId]);

  // Handle what happens when seat timer expires
  const handleSeatsTimeout = useCallback(() => {
    toast.error(`Thời gian giữ chỗ đã hết cho tất cả ghế đã chọn.`);
    setSelectedSeats([]);
  }, []);

  // Updated handler to update the timestamp whenever a seat is selected
  const handleSetSelectedSeats = useCallback((updater: React.SetStateAction<any[]>) => {
    setSelectedSeats((prevSeats) => {
      const newSeats = typeof updater === 'function' ? updater(prevSeats) : updater;

      // If any new seat is added, update the last selection time
      if (newSeats.length > prevSeats.length) {
        setLastSelectionTime(Date.now());
      }

      return newSeats;
    });
  }, []);

  // Calculate the total number of seats that should be selected based on ticket quantities
  const maxSeats = (tickets || []).reduce(
    (acc: number, ticket: any) => acc + (ticket.quantity || 0),
    0,
  );

  // Update the timer when seats are selected
  useEffect(() => {
    if (selectedSeats.length > 0 && !lastSelectionTime) {
      setLastSelectionTime(Date.now());
    } else if (selectedSeats.length === 0) {
      setLastSelectionTime(null);
    }
  }, [selectedSeats]);

  const handleNext = async () => {
    if (selectedSeats.length !== maxSeats) {
      toast.error(`Vui lòng chọn đúng ${maxSeats} ghế.`);
      return;
    }

    if (!connection) {
      toast.error("Mất kết nối đến server!");
      return;
    }

    try {
      // Create an array of TicketDetailRequest objects for SignalR
      const ticketRequests = selectedSeats.map((ticket) => ({
        TicketId: ticket.ticketId,
        Version: ticket.version,
        // ShowTimeId: showTimeId,
      }));

      // Use SignalR to update seat status to PENDING (broadcast to all clients)
      await connection.invoke("SetSeatPending", ticketRequests, showTimeId);

      toast.success("Chuyển đến trang thanh toán...");

      // Navigate directly to the payment page
      navigate("/ticket/payment", {
        state: {
          selectedDate,
          selectedTime,
          tickets,
          seats: selectedSeats.map((seat) => seat.name),
          selectedSeatsInfo: selectedSeats,
          showTimeId, // Pass the showTimeId to the payment page
        },
      });
    } catch (error) {
      console.error("Error when booking:", error);
      toast.error("Lỗi khi đặt chỗ! Có thể ghế đã được người khác chọn.");
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
            {selectedSeats.length > 0 && lastSelectionTime && (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: "rgba(27, 38, 53, 0.7)",
                  color: "white",
                  borderRadius: 2
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Thời gian giữ ghế:
                </Typography>
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                  <SeatCountdown
                    seatId="all-seats"
                    seatName={`${selectedSeats.length} ghế`}
                    startTime={lastSelectionTime}
                    onTimeout={handleSeatsTimeout}
                  />
                </Box>
              </Paper>
            )}
            <StepTracker currentStep={2} />
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
              <StepTracker currentStep={2} />
            </Box>

            {/* Seat selection section */}
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                align="center"
                fontFamily={"JetBrains Mono"}
                sx={{ textTransform: "uppercase", mb: 4 }}
              >
                Chọn Ghế
              </Typography>

              {/* Mobile timer display */}
              {selectedSeats.length > 0 && lastSelectionTime && (
                <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      backgroundColor: "rgba(27, 38, 53, 0.7)",
                      color: "white",
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Thời gian giữ ghế:
                    </Typography>
                    <Box sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}>
                      <SeatCountdown
                        seatId="all-seats-mobile"
                        seatName={`${selectedSeats.length} ghế`}
                        startTime={lastSelectionTime}
                        onTimeout={handleSeatsTimeout}
                      />
                    </Box>
                  </Paper>
                </Box>
              )}

              <Box
                sx={{
                  backgroundColor: "rgba(11, 13, 26, 0.6)",
                  borderRadius: 2,
                  p: 3,
                  mb: 4,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
                }}
              >
                <SeatCinema
                  showTimeId={showTimeId}
                  selectedSeats={selectedSeats}
                  setSelectedSeats={handleSetSelectedSeats}
                  connection={connection}
                />

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    color: "primary.light",
                  }}
                >
                  {`Bạn cần chọn đúng ${maxSeats} ghế.`}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{
                    px: 4,
                    py: 1,
                    fontSize: "1rem",
                    borderRadius: 2,
                  }}
                >
                  Tiếp tục
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default MovieSeat;
