import React, { useState } from "react";
import { Container } from "@mui/material";
import StepTracker from "../../components/Ticket/StepTracker.tsx";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import MovieDetail from "../../components/Movie/MovieDetail";
import ListCinema from "../../components/Ticket/ListCinema";
import ShowTime from "../../components/Ticket/ShowTime";

const Ticket = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <Header />
      <StepTracker currentStep={currentStep} />
      <MovieDetail />
      <ShowTime />
      <ListCinema />
      <Container>
        {/* Main content */}
      </Container>
      <Footer />
    </>
  );
};

export default Ticket;
