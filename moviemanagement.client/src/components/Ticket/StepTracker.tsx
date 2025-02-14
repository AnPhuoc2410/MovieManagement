import React, { useState, useEffect } from "react";
import { Box, Stepper, Step, StepLabel, Paper } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const steps = [
  { label: "Select Showtime", icon: <MovieIcon /> },
  { label: "Choose Seats", icon: <EventSeatIcon /> },
  { label: "Payment", icon: <PaymentIcon /> },
  { label: "Confirmation", icon: <CheckCircleIcon /> },
];

const StepTracker: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const [isVisible, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    
    <Box
      sx={{
        position: isVisible ? "fixed" : "absolute",
        top: isVisible ? 64 : "auto", // Adjust for AppBar height
        left: 0,
        padding: 1,
        width: "100%",
        backgroundColor: "transparent", // Matches Header
        color: "white",
        boxShadow: isVisible ? "0px 4px 10px rgba(0,0,0,0.3)" : "none",
        zIndex: 999,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Paper sx={{ padding: 2, backgroundColor: "rgb(244, 214, 94)", color: "white" }}>
        <Stepper activeStep={currentStep - 1} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={() => (
                  <Box sx={{ color: index < currentStep ? "lightgreen" : "gray" }}>
                    {step.icon}
                  </Box>
                )}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: index < currentStep ? "white" : "gray",
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default StepTracker;
