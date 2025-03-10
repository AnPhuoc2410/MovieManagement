import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import MovieDetail from "../../components/Movie/MovieDetail";
import ShowTimeCinema from "../../components/Ticket/ShowTimeCinema";
import TicketPrice, { TicketType } from "../../components/Ticket/TicketPrice";
import Footer from "../../components/home/Footer";
import toast from "react-hot-toast";

const Ticket: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>("");

  // You can still retrieve movieId from location or params if needed.
  const movieId = "5CC368FD-5BFA-4B06-A88C-1E659A26C224";

  const handleTicketSelection = (tickets: TicketType[]) => {
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
  };

  return (
    <>
      {/* Step tracker at top */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
        <StepTracker currentStep={1} />
      </Box>
      <Container
        sx={{
          paddingTop: { xs: "80px", sm: "90px", md: "100px" },
          position: "relative",
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{ color: "white", mb: 3, mt: 2 }}>
          {/* Movie details */}
          <MovieDetail />

          {/* ShowTimeCinema component for picking date, time, and room */}
          <ShowTimeCinema
            movieId={movieId}
            onRoomSelect={(roomId: string) => setRoomId(roomId)}
            onSelectDate={(date: string) => setSelectedDate(date)}
            onSelectTime={(time: string) => setSelectedTime(time)}
          />

          {/* TicketPrice for selecting ticket types/quantities */}
          <TicketPrice onNext={handleTicketSelection} />
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default Ticket;
