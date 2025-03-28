import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CssBaseline,
  Stack
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SeatCinema from "../../../components/admin/SeatCinema";
import toast from "react-hot-toast";
import { useSignalR } from "../../../contexts/SignalRContext";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import { useAuth } from "../../../contexts/AuthContext";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { connection, isConnected } = useSignalR();
  const { userDetails } = useAuth();
  const { movieId, selectedTime, selectedDate, tickets, movieData } = location.state || {
    movieId: "",
    selectedTime: "Not selected",
    selectedDate: new Date().toISOString().split('T')[0],
    tickets: [],
    movieData: {},
  };
  const [disableCustomTheme] = useState<boolean>(false);

  // Retrieve the current showTimeId from state or sessionStorage
  const currentShowTimeId = sessionStorage.getItem("currentShowTimeId") || "";

  // State to store selected seats
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; name: string; version: string; ticketId: string; isMine?: boolean; selectedAt?: number; roomName?: string }[]
  >([]);

  // Single timestamp for all seat selections
  const [lastSelectionTime, setLastSelectionTime] = useState<number | null>(null);
  // New state to force reset of countdown timer when seats change
  const [resetCounter, setResetCounter] = useState<number>(0);

  const handleSeatsTimeout = useCallback(() => {
    toast.error(`Thời gian giữ chỗ đã hết cho tất cả ghế đã chọn.`);
    setSelectedSeats([]);
  }, []);

  // Updated handler to update the timestamp whenever a seat is selected.
  const handleSetSelectedSeats = useCallback(
    (updater: React.SetStateAction<any[]>) => {
      setSelectedSeats((prevSeats) => {
        const newSeats =
          typeof updater === "function" ? updater(prevSeats) : updater;
        if (newSeats.length !== prevSeats.length) {
          // Whenever seats are added or removed, reset the countdown
          setLastSelectionTime(Date.now());
          setResetCounter(prev => prev + 1);
        }
        return newSeats;
      });
    },
    []
  );

  // Calculate the total number of seats that should be selected based on ticket quantities
  const maxSeats = (tickets || []).reduce(
    (acc: number, ticket: any) => acc + (ticket.quantity || 0),
    0
  );

  // Also update lastSelectionTime if there are no seats
  useEffect(() => {
    if (selectedSeats.length === 0) {
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
      const userId = userDetails?.userId;
      // Check seat availability from the current state in SeatCinema
      const unavailableSeats = selectedSeats.filter(seat => {
        // Find this seat in the SeatCinema component's state
        const seatElement = document.querySelector(`[data-seat-id="${seat.id}"]`);
        return seatElement?.getAttribute('data-status') === '1' ||
               seatElement?.getAttribute('data-status') === '2';
      });

      if (unavailableSeats.length > 0) {
        const seatNames = unavailableSeats.map(seat => seat.name).join(', ');
        toast.error(`Ghế ${seatNames} đã được người khác chọn. Vui lòng chọn ghế khác.`);
        return;
      }

      // Create an array of TicketDetailRequest objects for SignalR
      const ticketRequests = selectedSeats.map((ticket) => ({
        TicketId: ticket.ticketId,
        Version: ticket.version,
      }));

      // Call the SetSeatPending method on the server using the current showTimeId
      await connection.invoke("SetSeatPending", ticketRequests, currentShowTimeId, userId);

      toast.success("Chuyển đến trang thanh toán...");

      // Navigate to the payment page, passing the current showTimeId along with other state
      navigate("/admin/ql-ban-ve/payment", {
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
      toast.error("Lỗi khi đặt chỗ! Có thể ghế đã được người khác chọn.");
    }
  };

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
                  width: '100%',
                  borderRadius: 2
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'ActiveBorder', textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Chọn Ghế
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`Vui lòng chọn ${maxSeats} ghế cho suất chiếu ${selectedTime}`}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Seat selection section */}
                  <Paper
                    elevation={1}
                    sx={(theme) => ({
                      backgroundColor: alpha(theme.palette.background.default, 0.6),
                      p: 3,
                    })}
                  >
                    <Box sx={{
                      maxWidth: '800px',
                      mx: 'auto',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}>
                      <SeatCinema
                        showTimeId={currentShowTimeId}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={handleSetSelectedSeats}
                        groupConnected={isConnected}
                      />
                    </Box>
                  </Paper>

                  {/* Footer with action button */}
                  <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                    gap: 2
                  }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                    >
                      Quay lại
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      Tiếp tục
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default MovieSeat;
