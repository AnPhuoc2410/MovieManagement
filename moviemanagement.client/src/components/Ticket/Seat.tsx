import React from "react";
import { Box, Typography, Button } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";

// Define rows (A-F) and columns (1-7)
const rows = ["A", "B", "C", "D", "E", "F"];
const cols = [1, 2, 3, 4, 5, 6, 7];

interface SeatProps {
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
}

const Seat: React.FC<SeatProps> = ({ selectedSeats, setSelectedSeats }) => {
  // Example static arrays for bought and VIP seats
  const boughtSeats = ["A1", "B2", "C2", "D2", "A7", "A6", "C5", "C6", "C7"];
  const vipSeats = ["C3", "C4", "D3", "D4"];

  const handleSeatClick = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white", pb: 4 }}>
      {/* 1) Upward Arc Screen at the top */}
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          alignItems: "center",
        }}
      >
        {/* Legend on the Left */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Booked */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventSeatIcon sx={{ color: "red" }} />
            <Typography variant="body2">Đã Đặt</Typography>
          </Box>
          {/* Available */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventSeatIcon sx={{ color: "white" }} />
            <Typography variant="body2">Ghế Trống</Typography>
          </Box>
          {/* Selected */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventSeatIcon sx={{ color: "green" }} />
            <Typography variant="body2">Đang Chọn</Typography>
          </Box>
          {/* VIP */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventSeatIcon sx={{ color: "blue" }} />
            <Typography variant="body2">Ghế VIP</Typography>
          </Box>
        </Box>

        {/* Seat Grid on the Right */}
        <Box sx={{ maxWidth: 600 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {rows.map((row) => (
              <Box
                key={row}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                {cols.map((col) => {
                  const seatLabel = `${row}${col}`;
                  const isSelected = selectedSeats.includes(seatLabel);
                  const isBought = boughtSeats.includes(seatLabel);
                  const isVip = vipSeats.includes(seatLabel);

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
                      key={seatLabel}
                      variant="outlined"
                      disabled={disabled}
                      onClick={() => handleSeatClick(seatLabel)}
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
                          {seatLabel}
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
    </Box>
  );
};

export default Seat;
