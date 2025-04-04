import { Box, Button, Container, Paper, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import SeatCinema from "../../components/Ticket/SeatCinema";
import SeatCountdown from "../../components/Ticket/SeatCountdown";
import StepTracker from "../../components/Ticket/StepTracker";
import { useAuth } from "../../contexts/AuthContext";
import { useSignalR } from "../../contexts/SignalRContext";
import ShowTimeLayout from "../../layouts/ShowTimeLayout/ShowTimeLayout";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { connection, isConnected } = useSignalR();
  const { userDetails } = useAuth();
  const { movieId, selectedTime, selectedDate, tickets, movieData } = location.state || {
    movieId: "",
    selectedTime: "Not selected",
    selectedDate: new Date().toISOString().split("T")[0],
    tickets: [],
    movieData: {},
  };

  // Retrieve the current showTimeId from state or sessionStorage
  const currentShowTimeId = sessionStorage.getItem("currentShowTimeId") || "";

  // State to store selected seats
  const [selectedSeats, setSelectedSeats] = useState<{ id: string; name: string; version: string; ticketId: string; isMine?: boolean; selectedAt?: number; roomName?: string }[]>([]);

  // Single timestamp for all seat selections
  const [lastSelectionTime, setLastSelectionTime] = useState<number | null>(null);
  // New state to force reset of countdown timer when seats change
  const [resetCounter, setResetCounter] = useState<number>(0);

  // Handle what happens when seat timer expires
  const handleSeatsTimeout = useCallback(() => {
    toast.error(t("toast.error.seat.remainder"));
    setSelectedSeats([]);
  }, []);

  // Updated handler to update the timestamp whenever a seat is selected.
  const handleSetSelectedSeats = useCallback((updater: React.SetStateAction<any[]>) => {
    setSelectedSeats((prevSeats) => {
      const newSeats = typeof updater === "function" ? updater(prevSeats) : updater;
      if (newSeats.length !== prevSeats.length) {
        // Whenever seats are added or removed, reset the countdown
        setLastSelectionTime(Date.now());
        setResetCounter((prev) => prev + 1);
      }
      return newSeats;
    });
  }, []);

  // Calculate the total number of seats that should be selected based on ticket quantities
  const maxSeats = (tickets || []).reduce((acc: number, ticket: any) => acc + (ticket.quantity || 0), 0);

  // Also update lastSelectionTime if there are no seats
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setLastSelectionTime(null);
    }
  }, [selectedSeats]);

  const handleNext = async () => {
    if (selectedSeats.length !== maxSeats) {
      toast.error(`${t("toast.error.seat.max_selection")} ${maxSeats}`);
      return;
    }

    if (!connection) {
      toast.error(t("toast.error.server.connection"));
      return;
    }

    try {
      const userId = userDetails?.userId;
      // Check seat availability from the current state in SeatCinema
      const unavailableSeats = selectedSeats.filter((seat) => {
        // Find this seat in the SeatCinema component's state
        const seatElement = document.querySelector(`[data-seat-id="${seat.id}"]`);
        return seatElement?.getAttribute("data-status") === "1" || seatElement?.getAttribute("data-status") === "2";
      });

      if (unavailableSeats.length > 0) {
        const seatNames = unavailableSeats.map((seat) => seat.name).join(", ");
        toast.error(`${seatNames} ${t("toast.error.seat.someone_selected")}`);
        return;
      }

      // Create an array of TicketDetailRequest objects for SignalR
      const ticketRequests = selectedSeats.map((ticket) => ({
        TicketId: ticket.ticketId,
        Version: ticket.version,
      }));

      // Call the SetSeatPending method on the server using the current showTimeId
      await connection.invoke("SetSeatPending", ticketRequests, currentShowTimeId, userId);

      toast.success(t("toast.success.change_direct.payment"));

      // Navigate to the payment page, passing the current showTimeId along with other state
      navigate("/ticket/payment", {
        state: {
          movieId,
          selectedDate,
          selectedTime,
          tickets,
          seats: selectedSeats.map((seat) => seat.name),
          selectedSeatsInfo: selectedSeats,
          showTimeId: currentShowTimeId,
          lastSelectionTime,
          resetCounter,
          movieData,
          roomName: selectedSeats[0].roomName,
        },
      });
    } catch (error) {
      console.error("Error when booking:", error);
      toast.error(t("toast.error.seat.cannot_selected"));
    }
  };

  return (
    <ShowTimeLayout>
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
                  backgroundColor: "#121212",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {t("movie_seat.timer")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <SeatCountdown seatId="all-seats" seatName={`${selectedSeats.length} ghế`} startTime={lastSelectionTime!} resetTrigger={resetCounter} onTimeout={handleSeatsTimeout} />
                </Box>
              </Paper>
            )}
            <StepTracker currentStep={2} />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
            }}
          >
            {/* Show StepTracker on mobile */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              <StepTracker currentStep={2} />
            </Box>

            {/* Seat selection section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom align="center" fontFamily={"JetBrains Mono"} sx={{ textTransform: "uppercase", mb: 4 }}>
                {t("seat_cinema.screening")}
              </Typography>

              {/* Mobile timer display */}
              {selectedSeats.length > 0 && lastSelectionTime && (
                <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      backgroundColor: "#121212",
                      color: "white",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      {t("movie_seat.timer")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <SeatCountdown seatId="all-seats-mobile" seatName={`${selectedSeats.length} ghế`} startTime={lastSelectionTime!} resetTrigger={resetCounter} onTimeout={handleSeatsTimeout} />
                    </Box>
                  </Paper>
                </Box>
              )}

              <Box
                sx={{
                  backgroundColor: "#121212",
                  borderRadius: 2,
                  p: 3,
                  mb: 4,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
                }}
              >
                <SeatCinema showTimeId={currentShowTimeId} selectedSeats={selectedSeats} setSelectedSeats={handleSetSelectedSeats} groupConnected={isConnected} />

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
                  {t("movie_seat.continue")}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </ShowTimeLayout>
  );
};

export default MovieSeat;
