import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import Seat from "../../components/Ticket/Seat";
import Header from "../../components/home/Header";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const { selectedTime } = location.state || { selectedTime: "Not selected" };

  return (
    <>
      <Header />
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
          <Typography variant="body1" sx={{ fontSize: "0.9rem", color: "gray" }}>
            Selected Time: {selectedTime}
          </Typography>

          {/* Use Grid to create side columns */}
          <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 4 }}>
            {/* Left sidebar: add decorative content or leave empty */}
            <Grid item xs={false} md={2}>
              {/* You might add an image, ad, or leave this blank */}
              <Box
                sx={{
                  backgroundColor: "white",
                  height: "100%",
                  borderRadius: "8px",

                }}></Box>
            </Grid>

            {/* Center: main Seat component */}
            <Grid item xs={12} md={8}>
              <Seat />
            </Grid>

            {/* Right sidebar: add decorative content or leave empty */}
            <Grid item xs={false} md={2}>
              {/* Additional content or imagery */}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default MovieSeat;
