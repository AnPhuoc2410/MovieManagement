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
  // Lift the selected date and time to the parent component.
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // movieId could come from props, context, or elsewhere. For now we hardcode it.
  const movieId = "321fb7db-6361-4c64-8e16-fedfec9736a4";

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

            <MovieDetail />
            <ShowTimeCinema
              movieId={movieId}
              onSelectDate={(date: string) => setSelectedDate(date)}
              onSelectTime={(time: string) => setSelectedTime(time)}
            />
            <TicketPrice onNext={handleTicketSelection} />
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Ticket;
