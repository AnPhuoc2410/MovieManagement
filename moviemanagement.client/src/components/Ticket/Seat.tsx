import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import axios from "axios";
import type { Seat } from "../../types/seat.types";

interface SeatProps {
  roomId: string;
  selectedSeats: { id: string; name: string }[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<{ id: string; name: string }[]>>;
}

const Seat: React.FC<SeatProps> = ({ roomId, selectedSeats, setSelectedSeats }) => {
  const [seats, setSeats] = useState<Seat[]>([]);

  // Fetch seat data based on roomId.
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`https://localhost:7119/api/Room/GetRoomInfo/${roomId}`);
        if (response.data.isSuccess) {
          setSeats(response.data.data.seats);
        }
      } catch (error) {
        console.error("Error fetching seat data:", error);
      }
    };
    fetchSeats();
  }, [roomId]);

  // Toggle the selected seat when a seat button is clicked.
  const handleSeatClick = (seat: Seat) => {
    const seatName = `${seat.atRow}${seat.atColumn}`;
    const seatInfo = { id: seat.seatId, name: seatName };

    if (selectedSeats.some(s => s.id === seat.seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatInfo]);
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

      {/* Legend moved off-screen */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "absolute",
          top: "200px",
          left: "-150px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
      </Box>

      {/* Seat Grid centered on screen */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
        <Box sx={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 2 }}>
          {Object.entries(
            seats.reduce((acc, seat) => {
              // Group seats by row
              if (!acc[seat.atRow]) acc[seat.atRow] = [];
              acc[seat.atRow].push(seat);
              return acc;
            }, {} as Record<string, Seat[]>)
          ).map(([row, rowSeats]) => (
            <Box key={row} sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {rowSeats.map((seat) => {
                const isSelected = selectedSeats.some(s => s.id === seat.seatId);
                const isBought = seat.status === 3; // Booked
                const isVip = seat.seatType.typeName === "VIP";

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
                    key={seat.seatId}
                    variant="outlined"
                    disabled={disabled}
                    onClick={() => handleSeatClick(seat)}
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
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <EventSeatIcon sx={{ color: iconColor }} />
                      <Typography variant="body2" align="center">
                        {seat.atRow}
                        {seat.atColumn}
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

export default Seat;
