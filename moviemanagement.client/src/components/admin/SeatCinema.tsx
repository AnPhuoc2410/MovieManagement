import EventSeatIcon from "@mui/icons-material/EventSeat";
import { Box, Button, Typography, Paper, Divider, useTheme, alpha } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { TicketDetail } from "../../types/ticketdetail.types";
import { SelectedSeat } from "../../types/selectedseat.types";
import { useSignalR } from "../../contexts/SignalRContext";
import Loader from "../shared/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { purple } from "@mui/material/colors";

interface SeatProps {
  showTimeId: string;
  selectedSeats: SelectedSeat[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<SelectedSeat[]>>;
  groupConnected: boolean;
  onSeatInfoStored?: (seatId: string, seatTypeId: string, seatTypeName: string, price: number) => void;
}

const SeatCinema: React.FC<SeatProps> = ({
  showTimeId,
  selectedSeats,
  setSelectedSeats,
  groupConnected,
  onSeatInfoStored
}) => {
  const theme = useTheme();
  const { connection } = useSignalR();
  const { userDetails } = useAuth();
  const { t } = useTranslation();
  const [seats, setSeats] = useState<TicketDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Determine the effective showTimeId: use the prop if provided, otherwise fallback to sessionStorage.
  const effectiveShowTimeId = showTimeId || sessionStorage.getItem("currentShowTimeId") || "";

  // Listen for backend status updates (pending, bought, etc.) via SignalR.
  useEffect(() => {
    if (!connection || !groupConnected) return;

    const handleSeatPending = (seatId: string, userId: string) => {
      console.log("Seat marked as pending:", seatId);
      const currentUserId = userDetails?.userId;
      if (userId !== currentUserId) {
        setSeats((prev) => prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 1 } : ticket)));

        // Also remove this seat from our selection if we had it selected
        setSelectedSeats((prev) => {
          const selectedSeat = prev.find((seat) => seat.id === seatId);
          if (selectedSeat) {
            toast.error(`${selectedSeat.name} ${t("toast.error.someone_selected")}`);
            return prev.filter((seat) => seat.id !== seatId);
          }
          return prev;
        });
      }
    };

    const handleSeatBought = (seatId: string) => {
      setSeats((prev) => prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 2 } : ticket)));
    };

    const handleSeatSelected = (seatId: string, userId: string) => {
      const currentUserId = userDetails?.userId;
      if (userId !== currentUserId) {
        setSeats((prev) => prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 1 } : ticket)));
      }
    };

    const handleSeatAvailable = (seatId: string) => {
      console.log("Received SeatAvailable event for:", seatId);

      setSeats((prev) => prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 0 } : ticket)));
      // Remove auto-released seats from the current selection using ticketId
      setSelectedSeats((prev) => prev.filter((seat) => seat.id !== seatId));
    };

    connection.on("SeatPending", handleSeatPending);
    connection.on("SeatBought", handleSeatBought);
    connection.on("SeatSelected", handleSeatSelected);
    connection.on("SeatAvailable", handleSeatAvailable);

    return () => {
      connection.off("SeatPending", handleSeatPending);
      connection.off("SeatBought", handleSeatBought);
      connection.off("SeatSelected", handleSeatSelected);
      connection.off("SeatAvailable", handleSeatAvailable);
    };
  }, [connection, groupConnected, setSelectedSeats]);

  useEffect(() => {
    const releaseSeatsOnReturn = async () => {
      if (connection && selectedSeats.length > 0) {
        const userId = userDetails?.userId;
        const ticketRequests = selectedSeats.map((seat) => ({
          TicketId: seat.ticketId,
          Version: seat.version,
        }));

        try {
          await connection.invoke("ReleasePendingSeats", ticketRequests, effectiveShowTimeId, userId);
          setSelectedSeats([]); // Clear locally stored selections
          toast(t("toast.error.seat.cancel_booking_bc_back"), {
            position: "top-center",
          });
        } catch (error) {
          console.error("Error releasing seats on return:", error);
        }
      }
    };

    releaseSeatsOnReturn();
  }, [connection]);

  // Fetch ticket data by effectiveShowTimeId.
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`ticketdetail/showtime/${effectiveShowTimeId}`);
        if (response.data?.data) {
          setSeats(response.data.data);

          // Store seat type info for each seat when data is loaded
          if (onSeatInfoStored) {
            response.data.data.forEach((ticket: TicketDetail) => {
              if (ticket.seat && ticket.seat.seatType) {
                onSeatInfoStored(
                  ticket.seatId,
                  ticket.seat.seatType.seatTypeId,
                  ticket.seat.seatType.typeName,
                  ticket.seat.seatType.price
                );
              }
            });
          }
        } else {
          toast.error(t("toast.error.seat.infor"));
        }
      } catch (error) {
        toast.error(t("toast.error.seat.loading_list"));
      } finally {
        setLoading(false);
      }
    };
    if (effectiveShowTimeId) {
      fetchSeats();
    }
  }, [effectiveShowTimeId, onSeatInfoStored]);

  const handleSeatClick = async (ticket: TicketDetail) => {
    if (!connection) {
      toast.error(t("toast.server.connection"));
      return;
    }

    // Don't allow selecting seats that are already pending or bought
    if (ticket.status === 1 || ticket.status === 2) {
      const statusText = ticket.status === 1 ? t("toast.error.seat.selecting") : t("toast.error.seat.bought");
      toast.error(`${ticket.seat.atRow}${ticket.seat.atColumn} ${statusText} ${"toast.error.seat.by_someone"}`);
      return;
    }

    const seatName = `${ticket.seat.atRow}${ticket.seat.atColumn}`;
    const seatTypeId = ticket.seat.seatType.seatTypeId;
    const seatTypeName = ticket.seat.seatType.typeName;
    const seatPrice = ticket.seat.seatType.price;

    const seatInfo: SelectedSeat = {
      id: ticket.seatId,
      name: seatName,
      version: ticket.version,
      ticketId: ticket.ticketId,
      roomName: ticket.seat.roomName,
      seatTypeName: seatTypeName,
      price: seatPrice,
      isMine: true,
      selectedAt: Date.now(),
    };

    try {
      const userId = userDetails?.userId;

      // Prepare the updated seats selection based on the user's action
      let updatedSeats: SelectedSeat[] = [...selectedSeats]; // Start with current selection
      const existingSeatIndex = selectedSeats.findIndex((s) => s.ticketId === ticket.ticketId);

      if (existingSeatIndex !== -1) {
        if (selectedSeats[existingSeatIndex].id === ticket.seatId) {
          // User is deselecting this seat
          updatedSeats = updatedSeats.filter((s) => s.ticketId !== ticket.ticketId);
        } else {
          // User is changing from one seat to another with the same ticketId
          updatedSeats[existingSeatIndex] = seatInfo;
        }
      } else {
        // User is selecting a new seat
        updatedSeats.push(seatInfo);
      }

      // Create ticket requests from the updated selection
      const ticketRequests = updatedSeats.map((seat) => ({
        TicketId: seat.ticketId,
        Version: seat.version,
      }));

      console.log("Selecting seat:", seatName, ticketRequests, effectiveShowTimeId, userId);

      // Send the COMPLETE updated selection to server
      await connection.invoke("SelectSeat", ticketRequests, effectiveShowTimeId, userId);

      // Update local state if server operation succeeded
      setSelectedSeats((prevSeats) => {
        const existingSeat = prevSeats.find((s) => s.ticketId === ticket.ticketId);
        if (existingSeat) {
          if (existingSeat.id === ticket.seatId) {
            toast.error(`${t("toast.error.seat.cancel_select")} ${seatName}`);
            return prevSeats.filter((s) => s.ticketId !== ticket.ticketId);
          } else {
            toast.success(`${t("toast.success.seat.change_from")} ${existingSeat.name} ${t("toast.success.seat.change_to")} ${seatName}`);
            return prevSeats.map((s) => (s.ticketId === ticket.ticketId ? seatInfo : s));
          }
        } else {
          toast.success(`${t("toast.success.seat.select")} ${seatName}`);
          return [...prevSeats, seatInfo];
        }
      });
    } catch (error) {
      toast.error(t("toast.error.seat.cannot_selected"));
      console.error("Error selecting seat:", error);
    }
  };

  if (loading) return <Loader />;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      {/* Seat Legend */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          mb: 4,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventSeatIcon sx={{ color: theme.palette.info.main }} />
          <Typography variant="body2">Ghế VIP</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventSeatIcon sx={{ color: "#ab47bc" }} />
          <Typography variant="body2">Ghế Couple</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventSeatIcon sx={{ color: theme.palette.success.main }} />
          <Typography variant="body2">Ghế đang chọn</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventSeatIcon sx={{ color: theme.palette.error.main }} />
          <Typography variant="body2">Ghế đã bán</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventSeatIcon sx={{ color: theme.palette.warning.main }} />
          <Typography variant="body2">Ghế đã chọn</Typography>
        </Box>
      </Box>

      {/* Screen Display */}
      <Box sx={{ textAlign: "center", mb: 4, mt: 2 }}>
        <Box
          sx={{
            margin: "0 auto",
            width: "80%",
            height: "10px",
            backgroundColor: "#121212",
            borderRadius: "50% 50% 0 0",
            padding: "20px 0",
            position: "relative",
          }}
        />
        <Typography variant="h6" sx={{ mt: 1, color: theme.palette.text.secondary, fontWeight: 500 }}>
          Màn hình
        </Typography>
      </Box>

      {/* Seat Grid */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
        <Box sx={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(
            seats.reduce(
              (acc, ticket) => {
                if (!acc[ticket.seat.atRow]) acc[ticket.seat.atRow] = [];
                acc[ticket.seat.atRow].push(ticket);
                return acc;
              },
              {} as Record<string, TicketDetail[]>,
            ),
          ).map(([row, rowSeats]) => (
            <Box key={row} sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {rowSeats.map((ticket) => {
                if (!ticket.seat.isActive) {
                  return (
                    <Box
                      key={ticket.seatId}
                      sx={{
                        minWidth: "50px",
                        minHeight: "50px",
                        p: 0.5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px dashed rgba(255, 255, 255, 0.2)",
                        borderRadius: "4px",
                        opacity: 0.3,
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          width: "90%",
                          height: "1px",
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          transform: "rotate(45deg)",
                        }}
                      />
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          color: "rgba(255, 255, 255, 0.5)",
                          fontSize: "0.7rem",
                        }}
                      >
                        {ticket.seat.atRow}
                        {ticket.seat.atColumn}
                      </Typography>
                    </Box>
                  );
                }

                const isSelectedByMe = selectedSeats.some((s) => s.id === ticket.seatId && s.isMine);
                const isPending = ticket.status === 1;
                const isBought = ticket.status === 2;
                const typeName = ticket.seat.seatType.typeName;
                const isVip = typeName === "VIP";
                const isCouple = typeName === "Couple";

                // Use theme colors
                let iconColor = theme.palette.text.primary;
                let backgroundColor = "transparent";
                let textColor = theme.palette.text.primary;
                let disabled = false;

                if (isSelectedByMe) {
                  iconColor = theme.palette.success.main;
                  backgroundColor = alpha(theme.palette.success.main, 0.1);
                  textColor = theme.palette.success.dark;
                } else if (isBought) {
                  iconColor = theme.palette.error.main;
                  backgroundColor = alpha(theme.palette.error.main, 0.1);
                  textColor = theme.palette.error.dark;
                  disabled = true;
                } else if (isPending) {
                  iconColor = theme.palette.warning.main;
                  backgroundColor = alpha(theme.palette.warning.main, 0.1);
                  textColor = theme.palette.warning.dark;
                  disabled = true;
                } else if (isVip) {
                  iconColor = "#2196f3";
                  backgroundColor = alpha("#2196f3", 0.1);
                  textColor = "#1976d2";
                } else if (isCouple) {
                  iconColor = "#ab47bc";
                  backgroundColor = alpha("#ab47bc", 0.1);
                  textColor = "#8e24aa";
                }

                return (
                  <Button
                    key={ticket.seatId}
                    variant="outlined"
                    disabled={disabled}
                    onClick={() => handleSeatClick(ticket)}
                    data-seat-id={ticket.seatId}
                    data-status={ticket.status}
                    sx={{
                      minWidth: "50px",
                      minHeight: "50px",
                      backgroundColor,
                      color: textColor,
                      border: `1px solid ${iconColor}`,
                      p: 0.5,
                      fontSize: "0.7rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: alpha(iconColor, 0.15),
                        borderColor: iconColor,
                      },
                      "&.Mui-disabled": {
                        backgroundColor,
                        color: textColor,
                        borderColor: iconColor,
                        opacity: 0.6,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <EventSeatIcon sx={{ color: iconColor }} />
                      <Typography variant="body2" align="center" sx={{ color: textColor }}>
                        {ticket.seat.atRow}
                        {ticket.seat.atColumn}
                      </Typography>
                    </Box>
                  </Button>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default SeatCinema;
