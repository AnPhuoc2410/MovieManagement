import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seat from "../../components/Ticket/Seat";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";
import toast from "react-hot-toast";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTime, selectedDate, tickets } = location.state || {
    selectedTime: "Not selected",
    selectedDate: "Not selected",
    tickets: [],
  };

  // State to store selected seats
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Calculate the total number of seats that should be selected based on ticket quantities
  const maxSeats = (tickets || []).reduce(
    (acc: number, ticket: any) => acc + (ticket.quantity || 0),
    0,
  );

  const handleNext = () => {
    if (selectedSeats.length !== maxSeats) {
      toast.error(`Vui lòng chọn đúng ${maxSeats} ghế.`);
      return;
    }
    navigate("/payment", {
      state: { selectedDate, selectedTime, tickets, seats: selectedSeats },
    });
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
          mt: 5,
          textAlign: "center",
        }}
      >
        <Container>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            border={1}
          >
            <Grid item xs={12}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                align="center"
                fontFamily={"JetBrains Mono"}
                sx={{ textTransform: "uppercase", mb: 4 }}
              >
                Chọn Ghế
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              {/* Seat component handles seat selection */}
              <Seat
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
              />
              <Typography variant="body2" sx={{ mt: 2 }}>
                {`Bạn cần chọn đúng ${maxSeats} ghế.`}
              </Typography>
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
