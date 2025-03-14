import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import axios from "axios";
import toast from "react-hot-toast";
import { SeatType } from "../../types/seattype.types";
import { Seat } from "../../types/seat.types";
import { TicketDetail } from "../../types/ticketdetail.types";

interface SeatProps {
  showTimeId: string; // Changed from showtimeId to showTimeId for consistency
  selectedSeats: { id: string; name: string; version: string }[];
  setSelectedSeats: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; version: string }[]>
  >;
}

const SeatCinema: React.FC<SeatProps> = ({
  showTimeId, // Changed from showtimeId to showTimeId
  selectedSeats,
  setSelectedSeats,
}) => {
  const [seats, setSeats] = useState<TicketDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch ticket data based on showTimeId.
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://localhost:7119/api/ticketdetail/getbyroomid/${showTimeId}` // Updated endpoint URL
        );
        if (response.data && response.data.data) {
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

  // Toggle seat selection
  const handleSeatClick = (ticket: TicketDetail) => {
    const seatName = `${ticket.seat.atRow}${ticket.seat.atColumn}`;
    const seatInfo = { id: ticket.seatId, name: seatName, version: ticket.version };

    if (selectedSeats.some((s) => s.id === ticket.seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== ticket.seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatInfo]);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0B0D1A",
        color: "white",
        pb: 4,
        position: "relative",
      }}
    >
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

      {/* Legend (Positioned to the right) */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: 20,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventSeatIcon sx={{ color: "red" }} />
          <Typography variant="body2">Đã Đặt</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventSeatIcon sx={{ color: "white" }} />
          <Typography variant="body2">Ghế Trống</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventSeatIcon sx={{ color: "green" }} />
          <Typography variant="body2">Đang Chọn</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventSeatIcon sx={{ color: "blue" }} />
          <Typography variant="body2">Ghế VIP</Typography>
        </Box>
      </Box>

      {/* Seat Grid centered on screen */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {Object.entries(
            seats.reduce(
              (acc, ticket) => {
                // Group seats by row
                if (!acc[ticket.seat.atRow]) acc[ticket.seat.atRow] = [];
                acc[ticket.seat.atRow].push(ticket);
                return acc;
              },
              {} as Record<string, TicketDetail[]>
            )
          ).map(([row, rowSeats]) => (
            <Box
              key={row}
              sx={{ display: "flex", justifyContent: "center", gap: 4 }}
            >
              {rowSeats.map((ticket) => {
                const isSelected = selectedSeats.some(
                  (s) => s.id === ticket.seatId
                );
                const isBought = ticket.status !== 0; // Booked or Reserved
                const isVip = ticket.seat.seatType.typeName === "VIP";

                // Set default styles
                let iconColor = "white";
                let backgroundColor = "transparent";
                let disabled = false;

                if (isSelected) {
                  iconColor = "green";
                  backgroundColor = "rgba(0, 255, 0, 0.2)";
                } else if (isBought) {
                  iconColor = "red";
                  backgroundColor = "rgba(255, 0, 0, 0.2)";
                  disabled = true;
                } else if (isVip) {
                  iconColor = "blue";
                  backgroundColor = "rgba(0, 0, 255, 0.2)";
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
                      whiteSpace: "normal",
                      p: 0.5,
                      fontSize: "0.7rem",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: isSelected
                          ? "rgba(0, 255, 0, 0.4)"
                          : "rgba(255,255,255,0.2)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor,
                        color: "white",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
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
