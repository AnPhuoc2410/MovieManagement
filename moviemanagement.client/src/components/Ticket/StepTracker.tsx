import React, { useState, useEffect } from "react";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
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

interface StepTrackerProps {
  currentStep: number;
}

const StepTracker: React.FC<StepTrackerProps> = ({ currentStep }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      // 1) If user hasn't scrolled beyond 100px from top, always show
      if (currentScrollPos < 100) {
        setIsVisible(true);
      } 
      // 2) Else, if user is scrolling up, show tracker
      else if (currentScrollPos < lastScrollPos) {
        setIsVisible(false);
      } 
      // 3) If user is scrolling down, hide tracker
      else {
        setIsVisible(true);
      }

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollPos]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 75,
        left: 0,
        width: "100%",
        zIndex: 999,
        backgroundColor: "rgb(47, 39, 39)",
        transition: "transform 0.3s ease-in-out",
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
      }}
    >
      <Box sx={{ p: 2, color: "white" }}>
        <Stepper activeStep={currentStep - 1} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={() => (
                  <Box sx={{ color: index < currentStep ? "blue" : "gray" }}>
                    {step.icon}
                  </Box>
                )}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: index < currentStep ? "whitesmoke" : "gray",
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
};

export default StepTracker;
