import { Box, Container, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import MovieDetail from "../../components/Movie/MovieDetail";
import ShowTimeCinema from "../../components/Ticket/ShowTimeCinema";
import StepTracker from "../../components/Ticket/StepTracker";
import TicketPrice from "../../components/Ticket/TicketPrice";
import { SeatType } from "../../types/seattype.types"; // Import SeatType correctly
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import { useTranslation } from "react-i18next";

const Ticket: React.FC = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");
  const [showTicketPrice, setShowTicketPrice] = useState<boolean>(false);

  // Memoized callbacks
  const handleRoomSelect = useCallback((roomId: string) => {
    setRoomId(roomId);
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const handleShowtimeAvailability = useCallback((available: boolean) => {
    setShowTicketPrice(available);
  }, []);

  const handleTicketSelection = useCallback(
    (tickets: SeatType[]) => {  // ✅ Use SeatType instead of TicketType
      if (!selectedTime) {
        toast.error("Vui lòng chọn suất chiếu!");
        return;
      }
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
    },
    [movieId, navigate, roomId, selectedDate, selectedTime]
  );

  if (!movieId) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "white",
          backgroundColor: "#0B0D1A",
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          {t("oops")}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            p: 4,
            border: 2,
            borderColor: "red",
            color: "red",
            borderRadius: 2,
          }}
        >
          Phim không tồn tại.
        </Typography>
      </Box>
    );
  }

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
          pt: { xs: "70px", sm: "80px", md: "90px" },
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
              onRoomSelect={handleRoomSelect}
              onSelectDate={handleDateSelect}
              onSelectTime={handleTimeSelect}
              onShowtimeAvailability={handleShowtimeAvailability}
            />

            {/* Only render TicketPrice when needed */}
            {showTicketPrice && <TicketPrice onNext={handleTicketSelection} />}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Ticket;
