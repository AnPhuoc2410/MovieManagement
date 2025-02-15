import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/home/Header";
import StepTracker from "../../components/Ticket/StepTracker";
import MovieDetail from "../../components/Movie/MovieDetail";
import ListCinema from "../../components/Ticket/ListCinema";
import ShowTime from "../../components/Ticket/ShowTime";
import Footer from "../../components/home/Footer";

const Ticket = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    navigate("/movie-chair", { state: { selectedTime: time } });
  };

  return (
    <>
      <Header />
      <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
        <StepTracker currentStep={1} />
      </Box>
      <MovieDetail />
      <ShowTime />
      <ListCinema selectedTime={selectedTime} onTimeSelect={handleTimeSelect} />
      <Footer />
    </>
  );
};

export default Ticket;
