import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import MovieDetail from "../../components/Movie/MovieDetail";
import ShowTimeCinema from "../../components/Ticket/ShowTimeCinema";
import TicketPrice, { TicketType } from "../../components/Ticket/TicketPrice";
import Footer from "../../components/home/Footer";
import toast from "react-hot-toast";
import Header from "../../components/home/Header";

const Ticket: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  // New state to control the visibility of TicketPrice
  const [showTicketPrice, setShowTicketPrice] = useState<boolean>(false);

  // You can still retrieve movieId from location or params if needed.
  const movieId = "b6d29d0d-4d39-45d9-8f09-4f997a65d8cf";

  const handleTicketSelection = (tickets: TicketType[]) => {
    // Validate that a showtime is selected
    if (!selectedTime) {
      toast.error("Vui lòng chọn suất chiếu!");
      return;
    }
    // Validate that at least one ticket is selected
    const totalTickets = tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
    if (totalTickets === 0) {
      toast.error("Vui lòng chọn ít nhất 1 vé!");
      return;
    }
    navigate("/ticket/movie-seat", {
      state: {
        movieId,
        roomId,
        selectedDate,
        selectedTime,
        tickets,
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
          pt: { xs: "70px", sm: "80px", md: "90px" }, // Adjusted padding
          pb: { xs: 5, sm: 6, md: 8 },
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
          {/* Sticky StepTracker */}
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
            <StepTracker currentStep={1} />
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
              <StepTracker currentStep={1} />
            </Box>

            {/* Movie details */}
            <MovieDetail />

            {/* ShowTimeCinema component for picking date, time, and room */}
            <ShowTimeCinema
              movieId={movieId}
              onRoomSelect={(roomId: string) => setRoomId(roomId)}
              onSelectDate={(date: string) => setSelectedDate(date)}
              onSelectTime={(time: string) => setSelectedTime(time)}
              onShowtimeAvailability={(available: boolean) =>
                setShowTicketPrice(available)
              }
            />

            {/* Neu ko co ShowTime thi ko hien TicketPrice */}
            {showTicketPrice && <TicketPrice onNext={handleTicketSelection} />}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Ticket;
