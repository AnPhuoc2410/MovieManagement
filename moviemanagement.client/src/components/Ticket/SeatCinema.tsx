import EventSeatIcon from "@mui/icons-material/EventSeat";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import { TicketDetail } from "../../types/ticketdetail.types";
import { SelectedSeat } from "../../types/selectedseat.types";

interface SeatProps {
  showTimeId: string;
  selectedSeats: { id: string; name: string; version: string; ticketId: string; isMine?: boolean }[];
  setSelectedSeats: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; version: string; ticketId: string; isMine?: boolean }[]>
  >;
  connection: any;
}

const SeatCinema: React.FC<SeatProps> = ({ showTimeId, selectedSeats, setSelectedSeats, connection }) => {
  const [seats, setSeats] = useState<TicketDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for backend status updates (pending and bought) via SignalR.
  useEffect(() => {
    if (!connection) return;

    connection.on("SeatPending", (seatId: string) => {
      setSeats((prev) =>
        prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 1 } : ticket))
      );
    });

    connection.on("SeatBought", (seatId: string) => {
      setSeats((prev) =>
        prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 2 } : ticket))
      );
    });

    connection.on("SeatSelected", (seatId: string, userId: string) => {
      const currentUserId = localStorage.getItem("userId") || "anonymous";
      // Mark seats selected by others with special status
      if (userId !== currentUserId) {
        setSeats((prev) =>
          prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 1 } : ticket))
        );
      }
    });

    connection.on("SeatAvailable", (seatId: string) => {
      setSeats((prev) =>
        prev.map((ticket) => (ticket.seatId === seatId ? { ...ticket, status: 0 } : ticket))
      );

      // If this was our seat that got auto-released, we need to remove it from selections
      setSelectedSeats((prev) => prev.filter(seat => seat.id !== seatId));
    });

    return () => {
      connection.off("SeatPending");
      connection.off("SeatBought");
      connection.off("SeatSelected");
      connection.off("SeatAvailable");
    };
  }, [connection, setSelectedSeats]);

  // Fetch ticket data by showTimeId.
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`ticketdetail/getbyroomid/${showTimeId}`);
        if (response.data?.data) {
          setSeats(response.data.data);
        } else {
          toast.error("Không tìm thấy thông tin ghế.");
        }
      } catch (error) {
        toast.error("Lỗi khi tải danh sách ghế.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [showTimeId]);


  const handleSeatClick = async (ticket: TicketDetail) => {
    if (!connection) {
      toast.error("Mất kết nối đến server!");
      return;
    }

    const seatName = `${ticket.seat.atRow}${ticket.seat.atColumn}`;
    const seatInfo: SelectedSeat = {
      id: ticket.seatId,
      name: seatName,
      version: ticket.version,
      ticketId: ticket.ticketId,
      isMine: true,
      selectedAt: Date.now() // Add timestamp when seat is selected
    };

    try {
      // Try to select this seat on the server first
      //TODO: Add the userID to it
      await connection.invoke("SelectSeat", ticket.seatId, localStorage.getItem("userId") || "anonymous");

      setSelectedSeats((prevSeats) => {
        const existingSeat = prevSeats.find((s) => s.ticketId === ticket.ticketId);
        if (existingSeat) {
          if (existingSeat.id === ticket.seatId) {
            toast.error(`Bỏ chọn ghế ${seatName}`);
            return prevSeats.filter((s) => s.ticketId !== ticket.ticketId);
          } else {
            toast.success(`Đổi ghế từ ${existingSeat.name} sang ${seatName}`);
            return prevSeats.map((s) =>
              s.ticketId === ticket.ticketId ? seatInfo : s
            );
          }
        } else {
          toast.success(`Chọn ghế ${seatName}`);
          return [...prevSeats, seatInfo];
        }
      });
    } catch (error) {
      toast.error("Không thể chọn ghế này. Có thể ghế đã được người khác chọn.");
      console.error("Error selecting seat:", error);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white", pb: 4, position: "relative" }}>
      {/* Screen Display */}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Box
          sx={{
            margin: "0 auto",
            width: "80%",
            height: "70px",
            borderTop: "6px solid #fff",
            borderRadius: "50% 50% 0 0",
          }}
        />
        <Typography variant="h6" sx={{ mt: -2, color: "white" }}>
          Màn hình
        </Typography>
      </Box>

      {/* Seat Grid */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
        <Box sx={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(
            seats.reduce((acc, ticket) => {
              if (!acc[ticket.seat.atRow]) acc[ticket.seat.atRow] = [];
              acc[ticket.seat.atRow].push(ticket);
              return acc;
            }, {} as Record<string, TicketDetail[]>)
          ).map(([row, rowSeats]) => (
            <Box key={row} sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {rowSeats.map((ticket) => {
                const isSelectedByMe = selectedSeats.some(
                  (s) => s.id === ticket.seatId && s.isMine
                );
                const isPending = ticket.status === 1;
                const isBought = ticket.status === 2;
                const isVip = ticket.seat.seatType.typeName === "VIP";

                let iconColor = "white";
                let backgroundColor = "transparent";
                let disabled = false;

                if (isSelectedByMe) {
                  iconColor = "green";
                  backgroundColor = "rgba(0, 255, 0, 0.2)";
                } else if (isBought) {
                  iconColor = "red";
                  backgroundColor = "rgba(255, 0, 0, 0.2)";
                  disabled = true;
                } else if (isVip) {
                  iconColor = "blue";
                  backgroundColor = "rgba(0, 0, 255, 0.2)";
                } else if (isPending) {
                  iconColor = "yellow";
                  backgroundColor = "rgba(255, 255, 0, 0.2)";
                  disabled = true;
                }

                return (
                  <Button
                    key={ticket.seatId}
                    variant="outlined"
                    disabled={disabled}
                    onClick={() => handleSeatClick(ticket)}
                    sx={{
                      minWidth: "50px",
                      minHeight: "50px",
                      backgroundColor,
                      color: "white",
                      p: 0.5,
                      fontSize: "0.7rem",
                      "&:hover": {
                        backgroundColor: isSelectedByMe
                          ? "rgba(0, 255, 0, 0.4)"
                          : "rgba(255,255,255,0.2)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor,
                        color: "white",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <EventSeatIcon sx={{ color: iconColor }} />
                      <Typography variant="body2" align="center">
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
    </Box>
  );
};

export default SeatCinema;
