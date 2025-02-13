import React, { useState } from "react";
import { Container, Card, CardContent, Typography, ToggleButtonGroup, ToggleButton, Button, Box, Grid } from "@mui/material";
import { format, addDays } from "date-fns";
import { vi as viLocale } from "date-fns/locale";
import "./ShowTime.css"; // Import the new CSS file

const ShowTime: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(format(addDays(today, 1), "dd/MM"));
  let days = [];

  for (let i = 1; i <= 4; i++) {
    let day = addDays(today, i);
    days.push({
      formatted: format(day, "dd/MM"),
      label: format(day, "EEEE", { locale: viLocale }),
    });
  }

  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white", minHeight: "100vh", py: 15 }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight="bold" textAlign="center" mb={4} color="primary">
          LỊCH CHIẾU
        </Typography>

        {/* Date Selection */}
        <ToggleButtonGroup
          value={selectedDate}
          exclusive
          onChange={(e, newValue) => newValue && setSelectedDate(newValue)}
          className="date-toggle-group"
        >
          {days.map((day, index) => (
            <ToggleButton key={index} value={day.formatted} className="date-toggle-button">
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">{day.formatted}</Typography>
                <Typography variant="body2">{day.label}</Typography>
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Location Selection */}
        <Button variant="contained" color="secondary" fullWidth sx={{ mb: 4, py: 1.5, fontSize: "1rem" }}>
          📍 HỒ CHÍ MINH ▼
        </Button>

        {/* Cinema List */}
        <Grid container spacing={2}>
          {["Cinestar Quốc Thanh", "Cinestar Hai Bà Trưng (TP.HCM)"].map((cinema, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ backgroundColor: "#2D2F43", color: "white", borderRadius: "12px", p: 2 }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold">{cinema}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ShowTime;
