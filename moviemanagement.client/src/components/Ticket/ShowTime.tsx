import React from "react";
import { Container, Typography, ToggleButtonGroup, ToggleButton, Box } from "@mui/material";
import { format, addDays } from "date-fns";
import { vi as viLocale } from "date-fns/locale";

interface ShowTimeProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const ShowTime: React.FC<ShowTimeProps> = ({ selectedDate, onDateChange }) => {
  const today = new Date();
  const todayFormatted = format(today, "dd/MM");

  // Generate an array of 4 days: today plus the next 3 days
  const days = Array.from({ length: 4 }, (_, i) => {
    const day = addDays(today, i);
    return {
      formatted: format(day, "dd/MM"),
      label: format(day, "EEEE", { locale: viLocale }),
    };
  });

  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white", pt: 5, pb: 5 }}>
      <Container maxWidth="md">
        {/* Title */}
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          fontFamily="JetBrains Mono"
          mb={2}
          mt={2}
          sx={{ letterSpacing: "1px", textTransform: "uppercase" }}
        >
          Lịch chiếu
        </Typography>

        {/* Date Selection */}
        <ToggleButtonGroup
          value={selectedDate}
          exclusive
          onChange={(e, newValue) => {
            if (newValue) {
              onDateChange(newValue);
            }
          }}
          sx={{ display: "flex", justifyContent: "center", gap: 2 }}
        >
          {days.map((day, index) => {
            const isToday = day.formatted === todayFormatted;
            return (
              <ToggleButton
                key={index}
                value={day.formatted}
                sx={{
                  border: "2px solid yellow !important",
                  color: "yellow",
                  backgroundColor:
                  selectedDate === day.formatted ? "yellow" : "transparent",
                  "&.Mui-selected": {
                    backgroundColor: "yellow",
                    color: "#834bff",
                    fontWeight: "bold",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "yellow",
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                  borderRadius: "12px",
                  px: 3,
                  py: 2,
                  minWidth: "100px",
                  position: "relative", // needed to position the badge
                }}
              >
                {/* Render a badge if this day is today */}
                {isToday && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "4px",
                      px: 0.5,
                      fontWeight: "bold",
                    }}
                  >
                    Today
                  </Typography>
                )}
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" mb={1} fontFamily="JetBrains Mono">
                    {day.formatted}
                  </Typography>
                  <Typography variant="body2">{day.label}</Typography>
                </Box>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Container>
    </Box>
  );
};

export default ShowTime;
