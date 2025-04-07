import { Box, Button, Container, Paper, Typography } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
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
import { MovieSeatState } from "../../types/seattype.types";
import { SelectedSeat } from "../../types/selectedseat.types";
import Loader from "../../components/shared/Loading";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { connection, isConnected } = useSignalR();
  const { userDetails } = useAuth();

  const state = location.state as MovieSeatState | undefined;

  useEffect(() => {
    if (!state) {
      if (window.history.length > 1) {
        navigate(-1); // go back
      } else {
        navigate("/", { replace: true }); // fallback
      }
    }
  }, [state, navigate]);

  if (!state) return <Loader />;

  const { selectedTime, selectedDate, tickets, movieData } = state;

  // Retrieve the current showTimeId from state or sessionStorage
  const currentShowTimeId = sessionStorage.getItem("currentShowTimeId") || "";

  // State to store selected seats
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

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

  const renderSelectedSeatsSummary = () => {
    // Create an object to track selected seats by ticket type
    const selectedSeatsByType: Record<string, { count: number; names: string[] }> = {};

    // Initialize counters for each ticket type
    tickets.forEach((ticket) => {
      selectedSeatsByType[ticket.seatTypeId] = { count: 0, names: [] };
    });

    // Count selected seats by type
    selectedSeats.forEach((seat) => {
      const seatElement = document.querySelector(`[data-seat-id="${seat.id}"]`);
      const seatType = seatElement?.getAttribute("data-seat-type") || "Standard";

      if (selectedSeatsByType[seatType]) {
        selectedSeatsByType[seatType].count++;
        selectedSeatsByType[seatType].names.push(seat.name);
      }
    });

    if (selectedSeats.length === 0) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              fontWeight: "bold",
              mb: 1,
              borderBottom: "1px solid rgba(255,255,255,0.3)",
              pb: 1,
            }}
          >
            {t("seat.selection_status", "Trạng Thái Chọn Ghế")}
          </Typography>
          <Typography variant="body2" sx={{ color: "#f44336" }}>
            {t("seat.select_required", "Vui lòng chọn")} {maxSeats} {t("seat.seats", "ghế")}
          </Typography>

          {/* Display available ticket types */}
          <Box sx={{ mt: 2, pt: 1, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
              {t("ticket.available", "Vé Có Sẵn")}:
            </Typography>
            {tickets.map((ticket) => (
              <Box key={ticket.seatTypeId} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "white" }}>
                    {ticket.typeName}:
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "white", fontWeight: "bold" }}>
                  {ticket.quantity}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      );
    }

    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "rgba(0,0,0,0.7)",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "white",
            fontWeight: "bold",
            mb: 1,
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            pb: 1,
          }}
        >
          {t("seat.selected_summary", "Ghế Đã Chọn")} ({selectedSeats.length}/{maxSeats})
        </Typography>

        {/* Display ticket types with selection progress */}
        {tickets.map((ticket) => {
          const selected = selectedSeatsByType[ticket.seatTypeId] || { count: 0, names: [] };
          const isComplete = selected.count === ticket.quantity;

          return (
            <Box key={ticket.seatTypeId} sx={{ mb: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "white" }}>
                    {ticket.typeName}:
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: isComplete ? "lightgreen" : "white",
                    fontWeight: isComplete ? "bold" : "normal",
                  }}
                >
                  {selected.count}/{ticket.quantity}
                </Typography>
              </Box>

              {selected.names.length > 0 && (
                <Box sx={{ pl: 4, mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    {selected.names.join(", ")}
                  </Typography>
                </Box>
              )}

              {selected.count < ticket.quantity && (
                <Box sx={{ pl: 4 }}>
                  <Typography variant="caption" sx={{ color: "#f44336" }}>
                    {t("seat.remaining_type", "Còn")} {ticket.quantity - selected.count} {t("seat.to_select_type", "ghế cần chọn")}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Paper>
    );
  };

  const renderSeatLegend = () => {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "rgba(0,0,0,0.7)",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "white",
            fontWeight: "bold",
            mb: 1,
            borderBottom: "1px solid rgba(255,255,255,0.3)",
            pb: 1,
          }}
        >
          {t("seat.legend", "Chú Thích Ghế")}
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 1.5, alignItems: "center" }}>
          {/* Seat Status */}
          <EventSeatIcon sx={{ color: "white", fontSize: 22 }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            {t("seat.available", "Ghế Trống")}
          </Typography>

          <EventSeatIcon sx={{ color: "green", fontSize: 22 }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            {t("seat.selected", "Đang Chọn")}
          </Typography>

          <EventSeatIcon sx={{ color: "yellow", fontSize: 22 }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            {t("seat.pending", "Đang Thanh Toán")}
          </Typography>

          <EventSeatIcon sx={{ color: "red", fontSize: 22 }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            {t("seat.booked", "Đã Đặt")}
          </Typography>

          {/* Seat Types */}
          <Box sx={{ height: 1, backgroundColor: "rgba(255,255,255,0.3)", my: 1, gridColumn: "1 / span 2" }} />

          <EventSeatIcon sx={{ color: "blue", fontSize: 22 }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            {t("seat.vip", "Ghế VIP")}
          </Typography>

          <EventSeatIcon sx={{ color: "purple", fontSize: 22 }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            {t("seat.couple", "Ghế Couple")}
          </Typography>

          <EventSeatIcon sx={{ color: "gray", fontSize: 22 }} />
          <Typography variant="body2" sx={{ color: "white" }}>
            {t("seat.unavailable", "Không Thể Chọn")}
          </Typography>
        </Box>
      </Paper>
    );
  };

  // Calculate the total number of seats that should be selected based on ticket quantities
  const maxSeats = (tickets || []).reduce((acc: number, ticket: any) => acc + (ticket.quantity || 0), 0);

  useEffect(() => {
    if (maxSeats === 0) navigate(`/`);
    console.log(`State received: ${JSON.stringify(location.state, null, 2)}`);
  }, []);

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
          pb: { xs: 4, sm: 6, md: 8 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            minHeight: "100vh",
          }}
        >
          {/* Sticky StepTracker for desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              position: "sticky",
              mt: { xs: 2, sm: 3, md: 4 },
              top: { xs: "150px", sm: "150px", md: "150px" },
              height: "fit-content",
              width: "250px",
              backgroundColor: "transparent",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              flexShrink: 0,
            }}
          >
            {selectedSeats.length > 0 && lastSelectionTime && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <SeatCountdown seatId="all-seats" seatName={`${selectedSeats.length} ghế`} startTime={lastSelectionTime!} resetTrigger={resetCounter} onTimeout={handleSeatsTimeout} />
              </Box>
            )}
            {/* Selection summary for desktop */}
            {renderSelectedSeatsSummary()}
            {renderSeatLegend()}
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Show StepTracker on mobile */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              <StepTracker currentStep={2} />
            </Box>
            {/* Mobile timer display */}
            {selectedSeats.length > 0 && lastSelectionTime && (
              <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    color: "white",
                    borderRadius: 2,
                    backgroundColor: "rgba(0,0,0,0.7)",
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

            {/* Mobile display */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              {renderSelectedSeatsSummary()}
              {renderSeatLegend()}
            </Box>

            {/* Seat selection section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom align="center" fontFamily={"JetBrains Mono"} sx={{ textTransform: "uppercase", mb: 4 }}>
                {t("seat_cinema.screening")}
              </Typography>

              <Box
                sx={{
                  borderRadius: 2,
                  p: 3,
                  mb: 4,
                }}
              >
                <SeatCinema userTickets={tickets} showTimeId={currentShowTimeId} selectedSeats={selectedSeats} setSelectedSeats={handleSetSelectedSeats} groupConnected={isConnected} />
              </Box>
            </Box>

            {/* Mobile continue button */}
            {selectedSeats.length > 0 && (
              <Box
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  backgroundColor: "rgba(0,0,0,0.8)",
                  display: { xs: "flex", md: "none" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 10,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Typography variant="body2" sx={{ color: "white" }}>
                  {selectedSeats.length}/{maxSeats} {t("seat.selected", "đã chọn")}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={selectedSeats.length !== maxSeats}
                  sx={{
                    fontSize: "0.9rem",
                    backgroundColor: selectedSeats.length === maxSeats ? "#4CAF50" : undefined,
                  }}
                >
                  {t("movie_seat.continue")}
                </Button>
              </Box>
            )}
            {/* Desktop continue button */}
            {selectedSeats.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  display: { xs: "none", md: "flex" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 10,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Typography variant="body2" sx={{ color: "white" }}>
                  {selectedSeats.length}/{maxSeats} {t("seat.selected", "đã chọn")}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={selectedSeats.length !== maxSeats}
                  sx={{
                    px: 4,
                    py: 1,
                    fontSize: "1rem",
                    borderRadius: 2,
                    backgroundColor: selectedSeats.length === maxSeats ? "#4CAF50" : undefined,
                    "&:hover": {
                      backgroundColor: selectedSeats.length === maxSeats ? "#388E3C" : undefined,
                    },
                  }}
                >
                  {t("movie_seat.continue")}
                </Button>
              </Box>
            )}
          </Box>
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
            <StepTracker currentStep={2} />
          </Box>
        </Box>
      </Container>
    </ShowTimeLayout>
  );
};

export default MovieSeat;
