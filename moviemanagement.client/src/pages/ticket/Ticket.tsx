import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../../components/home/Header";
import MovieDetail from "../../components/Movie/MovieDetail";
import ListCinema from "../../components/Ticket/ListCinema";
import ShowTime from "../../components/Ticket/ShowTime";
import Footer from "../../components/home/Footer";
import StepTracker from "../../components/Ticket/StepTracker";

const Ticket = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <Header />

      {/* Step Tracker that hides/shows on scroll */}
      <StepTracker currentStep={currentStep} />

      <Box>
        <MovieDetail />
        <ShowTime />
        <ListCinema />
      </Box>

      <Footer />
    </>
  );
};

export default Ticket;
