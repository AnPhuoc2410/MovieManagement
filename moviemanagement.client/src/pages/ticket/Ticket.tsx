import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StepTracker from "../../components/Ticket/StepTracker";
import MovieDetail from "../../components/Movie/MovieDetail";
import ShowTime from "../../components/Ticket/ShowTime";
import ListCinema from "../../components/Ticket/ListCinema";
import TicketPrice, { TicketType } from "../../components/Ticket/TicketPrice";
import Footer from "../../components/home/Footer";
import { format } from "date-fns";

const Ticket: React.FC = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() => {
    return format(new Date(), "dd/MM");
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleTicketSelection = (tickets: TicketType[]) => {
    // Validate that a showtime is selected
    if (!selectedTime) {
      alert("Vui lòng chọn suất chiếu!");
      return;
    }
    // Validate that at least one ticket is selected
    const totalTickets = tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
    if (totalTickets === 0) {
      alert("Vui lòng chọn ít nhất 1 vé!");
      return;
    }
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
        <ShowTime
          selectedDate={selectedDate}
          onDateChange={(newDate) => setSelectedDate(newDate)}
        />

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
