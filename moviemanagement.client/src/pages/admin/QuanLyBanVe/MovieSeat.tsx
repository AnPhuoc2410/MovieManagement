import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CssBaseline,
  Stack,
  Chip
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
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import { Divider } from "antd";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { connection, isConnected } = useSignalR();
  const { userDetails } = useAuth();
  const {
    movieId,
    showTimeId: locationShowTimeId,
    selectedTime,
    selectedDate,
    movieData
  } = location.state || {
    movieId: "",
    showTimeId: "",
    selectedTime: "Not selected",
    selectedDate: new Date().toISOString().split('T')[0],
    movieData: {},
  };
  const [disableCustomTheme] = useState<boolean>(false);
  const DEFAULT_TICKET_TYPE = "adult";

  // Retrieve the current showTimeId from state or sessionStorage
  const currentShowTimeId = sessionStorage.getItem("currentShowTimeId") || "";

  // State to store selected seats
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; name: string; version: string; ticketId: string; isMine?: boolean; selectedAt?: number; roomName?: string; ticketType?: string; price?: number; seatTypeName?: string }[]
  >([]);

  // Single timestamp for all seat selections
  const [lastSelectionTime, setLastSelectionTime] = useState<number | null>(null);
  // New state to force reset of countdown timer when seats change
  const [resetCounter, setResetCounter] = useState<number>(0);
  // Map to store seat type prices
  const [seatTypePrices, setSeatTypePrices] = useState<Record<string, { price: number, name: string }>>({});

  const handleSeatsTimeout = useCallback(() => {
    toast.error(t("toast.error.seat.remainder"));
    setSelectedSeats([]);
  }, [t]);

  // Updated handler to update the timestamp whenever a seat is selected.
  const handleSetSelectedSeats = useCallback(
    (updater: React.SetStateAction<any[]>) => {
      setSelectedSeats((prevSeats) => {
        const newSeats =
          typeof updater === "function" ? updater(prevSeats) : updater;

        // Add default ticket type to newly added seats
        const seatsWithTicketType = newSeats.map(seat => {
          // If the seat doesn't have a ticketType or it's a newly added seat, assign the default ticket type
          if (!seat.ticketType && !prevSeats.find(prevSeat => prevSeat.id === seat.id)) {
            return { ...seat, ticketType: DEFAULT_TICKET_TYPE };
          }
          return seat;
        });

        if (seatsWithTicketType.length !== prevSeats.length) {
          // Whenever seats are added or removed, reset the countdown
          setLastSelectionTime(Date.now());
          setResetCounter(prev => prev + 1);
        }
        return seatsWithTicketType;
      });
    },
    []
  );

  // Also update lastSelectionTime if there are no seats
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setLastSelectionTime(null);
    }
  }, [selectedSeats]);

  // Store seat price information when a seat is selected
  const handleStoreSeatInfo = useCallback((seatId: string, seatTypeId: string, seatTypeName: string, price: number) => {
    setSeatTypePrices(prev => ({
      ...prev,
      [seatId]: { price, name: seatTypeName }
    }));
  }, []);

  const handleNext = async () => {
    if (selectedSeats.length === 0) {
      toast.error(t("toast.error.seat.min_selection"));
      return;
    }

    if (!connection) {
      toast.error(t("toast.error.server.connection"));
      return;
    }

    try {
      const userId = userDetails?.userId;
      // Check seat availability
      const unavailableSeats = selectedSeats.filter(seat => {
        const seatElement = document.querySelector(`[data-seat-id="${seat.id}"]`);
        return seatElement?.getAttribute('data-status') === '1' ||
          seatElement?.getAttribute('data-status') === '2';
      });

      if (unavailableSeats.length > 0) {
        const seatNames = unavailableSeats.map(seat => seat.name).join(', ');
        toast.error(`${seatNames} ${t("toast.error.seat.someone_selected")}`);
        return;
      }

      // Create ticket requests for SignalR
      const ticketRequests = selectedSeats.map((ticket) => ({
        TicketId: ticket.ticketId,
        Version: ticket.version,
      }));

      await connection.invoke("SetSeatPending", ticketRequests, currentShowTimeId, userId);
      toast.success(t("toast.success.change_direct.payment"));

      // Group seats by seat type to calculate totals
      const seatTypeQuantities: Record<string, { count: number, price: number, name: string }> = {};

      // Process each selected seat and group by seat type
      selectedSeats.forEach(seat => {
        if (seatTypePrices[seat.id]) {
          const { price, name } = seatTypePrices[seat.id];
          if (!seatTypeQuantities[name]) {
            seatTypeQuantities[name] = { count: 0, price, name };
          }
          seatTypeQuantities[name].count++;
        }
      });

      // Convert to array format needed for payment page
      const tickets = Object.values(seatTypeQuantities).map(({ name, count, price }) => ({
        id: name.toLowerCase(),
        type: name,
        quantity: count,
        price: price
      }));

      // If no seat types were found, use a default ticket type
      if (tickets.length === 0) {
        tickets.push({
          id: DEFAULT_TICKET_TYPE,
          type: DEFAULT_TICKET_TYPE,
          quantity: selectedSeats.length,
          price: 90000  // Default fallback price
        });
      }

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
          roomName: selectedSeats[0]?.roomName || "",
        },
      });
    } catch (error) {
      console.error("Error when booking:", error);
      toast.error(t("toast.error.seat.cannot_selected"));
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
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {t("step_tracker.select_seat")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("admin.ticket_management.select_seats_for_showtime")} {selectedTime}
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Selected seats summary */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t("admin.ticket_management.selected_seats")}:
                    </Typography>

                    {selectedSeats.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedSeats.map((seat, index) => (
                          <Chip
                            key={index}
                            label={`${seat.name} ${seatTypePrices[seat.id] ? `(${seatTypePrices[seat.id].name} - ${seatTypePrices[seat.id].price.toLocaleString()} VND)` : ''}`}
                            color="primary"
                            variant="outlined"
                            onDelete={() => {
                              setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t("admin.ticket_management.no_seats_selected")}
                      </Typography>
                    )}
                  </Box>

                  <Divider />

                  {/* Seat selection area */}
                  <Paper
                    elevation={1}
                    sx={(theme) => ({
                      backgroundColor: alpha(theme.palette.background.default, 0.6),
                      p: 3,
                      mt: 3
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
                        onSeatInfoStored={handleStoreSeatInfo}
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
                      {t("admin.ticket_management.come_back")}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      {t("admin.ticket_management.continue")}
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
