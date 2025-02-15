import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/home/Header";
import StepTracker from "../../components/Ticket/StepTracker";
import MovieDetail from "../../components/Movie/MovieDetail";
import ShowTime from "../../components/Ticket/ShowTime";
import ListCinema from "../../components/Ticket/ListCinema";
import Footer from "../../components/home/Footer";

const Ticket: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <Header />
      
      <Box sx={{ position: "sticky", top: 0, zIndex: 999 }}>
        <StepTracker currentStep={currentStep} />
      </Box>
      <MovieDetail />
      {currentStep === 1 && (
        <>
          <ShowTime selectedDate={selectedDate} onDateChange={setSelectedDate} />
          <ListCinema 
            selectedTime={selectedTime} 
            onTimeSelect={(time: string) => {
              setSelectedTime(time);
              navigate("/movie-seat", { state: { selectedTime: time, selectedDate } });
            }} 
          />
        </>
      )}
      <Footer />
    </>
  );
};

export default Ticket;
