import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seat from "../../components/Ticket/Seat";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";
import EventSeatIcon from "@mui/icons-material/EventSeat";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTime, selectedDate } = location.state || {
    selectedTime: "Not selected",
    selectedDate: "Not selected",
  };

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }
    navigate("/payment", {
      state: { selectedDate, selectedTime, seats: selectedSeats },
    });
  };

  return (
    <>
      {/* Step Tracker */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
        <StepTracker currentStep={2} />
      </Box>

      <Box
        sx={{
          backgroundColor: "#0B0D1A",
          color: "white",
          py: 10,
          mt: 2,
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center" fontFamily={"JetBrains Mono"} sx={{ textTransform: "uppercase" }}>
            Chọn Ghế
          </Typography>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            {/* Legend Column */}
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "left",
                }}
              >
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
            </Grid>

            {/* Seat Column */}
            <Grid item xs={12} md={8}>
              <Seat selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default MovieSeat;
