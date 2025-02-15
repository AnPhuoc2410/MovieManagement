import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seat from "../../components/Ticket/Seat";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTime, selectedDate } = location.state || { selectedTime: "Not selected", selectedDate: "Not selected" };

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleNext = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }
    // Navigate to Payment page with selectedTime and selectedSeats
    navigate("/payment", { state: { selectedDate, selectedTime, seats: selectedSeats } });
  };

  return (
    <>
      <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
        <StepTracker currentStep={2} />
      </Box>
      <Box
        sx={{
          backgroundColor: "#0B0D1A",
          color: "white",
          py: 10,
          mt: 2,
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Movie Seat Selection
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Selected Time: {selectedTime}
          </Typography>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8}>
              <Seat selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
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
