import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";

// Define rows (A-F) and columns (1-7)
const rows = ["A", "B", "C", "D", "E", "F"];
const cols = [1, 2, 3, 4, 5, 6, 7];

const Seat: React.FC = () => {
  // Track selected seats (you can expand this for more functionality)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [boughtSeats, setBoughtSeats] = useState<string[]>([
    "A1",
    "B2",
    "C2",
    "D2",
    "A7",
    "A6",
    "C5",
    "C6",
    "C7",
  ]); // Example bought seats
  const [vipSeats, setVipSeats] = useState<string[]>([
    "C3",
    "C4",
    "D3",
    "D4",
  ]); // Example VIP seats

  const handleSeatClick = (seat: string) => {
    // Toggle the seat's selection status
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <Box sx={{backgroundColor: "#0B0D1A", color: "white" }}>
      {/* TV/Screen area */}
      <Box
        sx={{
          width: "90%",
          height: "50px",
          backgroundColor: "rgba(240, 205, 205, 0.23)",
          margin: "0 auto",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          SCREEN
        </Typography>
      </Box>

      {/* Wrap the seating grid in a centered container with maxWidth */}
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Seating grid */}
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
                      backgroundColor: backgroundColor,
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
                        backgroundColor: backgroundColor,
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
  );
};

export default Seat;
