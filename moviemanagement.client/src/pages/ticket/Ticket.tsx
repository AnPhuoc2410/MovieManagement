import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import MovieDetail from "../../components/Movie/MovieDetail";
import ShowTime from "../../components/Ticket/ShowTime";
import ListCinema from "../../components/Ticket/ListCinema";
import TicketPrice, { TicketType } from "../../components/Ticket/TicketPrice";
import Footer from "../../components/home/Footer";

const Ticket: React.FC = () => {
  const navigate = useNavigate();

  // Selected date (Vietnamese format: dd/mm)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Called when the user selects tickets in TicketPrice
  const handleTicketSelection = (tickets: TicketType[]) => {
    // Navigate to movie-seat page with date, time, and chosen tickets
    navigate("/movie-seat", {
      state: {
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

      <Container sx={{ py: 4 }}>
        {/* Movie details */}
        <MovieDetail />

        {/* ShowTime component for picking date */}
        <ShowTime selectedDate={selectedDate} onDateChange={setSelectedDate} />

        {/* ListCinema for picking a showtime */}
        <ListCinema
          selectedTime={selectedTime}
          onTimeSelect={(time: string) => setSelectedTime(time)}
        />

        {/* TicketPrice for selecting ticket types/quantities */}
        <TicketPrice onNext={handleTicketSelection} />
      </Container>

      <Footer />
    </>
  );
};

export default Ticket;
