import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SeatCinema from "../../components/Ticket/SeatCinema";
import StepTracker from "../../components/Ticket/StepTracker";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import toast from "react-hot-toast";

const MovieSeat: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showTimeId, selectedTime, selectedDate, tickets } =
    location.state || {
      showTimeId: "", // Changed from showtimeId to showTimeId
      selectedTime: "Not selected",
      selectedDate: "Not selected",
      tickets: [],
    };

  // State to store selected seats
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; name: string; version: string }[]
  >([]);

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
    navigate("/ticket/payment", {
      state: {
        selectedDate,
        selectedTime,
        tickets,
        seats: selectedSeats.map((seat) => seat.name),
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom,
          rgba(11, 13, 26, 0.95) 0%,
          rgba(11, 13, 26, 0.85) 100%
        )`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 30%, rgba(78, 46, 131, 0.4) 0%, rgba(78, 46, 131, 0) 50%),
                      radial-gradient(circle at 75% 15%, rgba(33, 64, 154, 0.4) 0%, rgba(33, 64, 154, 0) 50%),
                      linear-gradient(135deg, #0B0D1A 0%, #1A1E3C 50%, #3A1155 100%)`,
          zIndex: -1,
        },
      }}
    >
      <Header />

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: "64px", sm: "72px", md: "80px" },
          pb: { xs: 4, sm: 6, md: 8 },
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3, md: 4 },
            color: "white",
            position: "relative",
            minHeight: "100vh",
          }}
        >
          {/* Sticky StepTracker for desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
              height: "fit-content",
              width: "250px",
              flexShrink: 0,
            }}
          >
            <StepTracker currentStep={2} />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3, md: 4 },
              pb: 4,
            }}
          >
            {/* Show StepTracker on mobile */}
            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              <StepTracker currentStep={2} />
            </Box>

            {/* Seat selection section */}
            <Box sx={{ mt: 2 }}>
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

              <Box
                sx={{
                  backgroundColor: "rgba(11, 13, 26, 0.6)",
                  borderRadius: 2,
                  p: 3,
                  mb: 4,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.25)",
                }}
              >
                <SeatCinema
                  showTimeId={showTimeId} // Changed from showtimeId to showTimeId
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                />

                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    textAlign: "center",
                    color: "primary.light",
                  }}
                >
                  {`Bạn cần chọn đúng ${maxSeats} ghế.`}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  sx={{
                    px: 4,
                    py: 1,
                    fontSize: "1rem",
                    borderRadius: 2,
                  }}
                >
                  Tiếp tục
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default MovieSeat;
