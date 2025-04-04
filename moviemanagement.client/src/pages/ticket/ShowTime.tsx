import { Box, Container, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import MovieDetail from "../../components/Movie/MovieDetail";
import ShowTimeCinema from "../../components/Ticket/ShowTimeCinema";
import StepTracker from "../../components/Ticket/StepTracker";
import TicketPrice from "../../components/Ticket/TicketPrice";
import ShowTimeLayout from "../../layouts/ShowTimeLayout/ShowTimeLayout";
import { SeatType } from "../../types/seattype.types";
import { useAuth } from "../../contexts/AuthContext";

const Ticket: React.FC = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { t } = useTranslation();
  const [movieData, setMovieData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimeId, setShowTimeId] = useState<string>("");
  const [showTicketPrice, setShowTicketPrice] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  // Memoized callbacks
  const handleRoomSelect = useCallback((showTimeId: string) => {
    setShowTimeId(showTimeId);
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

  const handleMovieLoad = useCallback((movie: any) => {
    setMovieData(movie);
  }, []);

  const handleTicketSelection = useCallback(
    (tickets: SeatType[]) => {
      if (!selectedTime) {
        toast.error(t("toast.error.showtime.selection"));
        return;
      }
      const totalTickets = tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
      if (totalTickets === 0) {
        toast.error(t("toast.error.ticket.selection"));
        return;
      }

      if (!isAuthenticated) toast.success("You need to login to continue booking tickets");
      setTimeout(() => {
        navigate("/ticket/movie-seat", {
          state: {
            movieId,
            showTimeId,
            selectedDate,
            selectedTime,
            tickets,
            movieData,
          },
        });
      }, 3000);
    },
    [movieId, navigate, showTimeId, selectedDate, selectedTime, movieData],
  );

  return (
    <ShowTimeLayout>
      {movieId ? (
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
                width: { xs: "100%", md: "300px" },
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
                width: { xs: "70%", sm: "70%", md: "70%", lg: "100%" },
                pb: 4,
              }}
            >
              {/* Show StepTracker on mobile */}
              <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
                <StepTracker currentStep={1} />
              </Box>

              {/* Movie details */}
              <MovieDetail onMovieLoad={handleMovieLoad} />

              {/* ShowTimeCinema component for picking date, time, and room */}
              <ShowTimeCinema movieId={movieId} onRoomSelect={handleRoomSelect} onSelectDate={handleDateSelect} onSelectTime={handleTimeSelect} onShowtimeAvailability={handleShowtimeAvailability} />

              {/* Only render TicketPrice when needed */}
              {showTicketPrice && <TicketPrice onNext={handleTicketSelection} />}
            </Box>
          </Box>
        </Container>
      ) : (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "white",
            background: `linear-gradient(to bottom,
          rgba(11, 13, 26, 0.95) 0%,
          rgba(11, 13, 26, 0.85) 100%
        )`,
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
            {t("translation.footer.movies.not_existing")}
          </Typography>
        </Box>
      )}
    </ShowTimeLayout>
  );
};

export default Ticket;
