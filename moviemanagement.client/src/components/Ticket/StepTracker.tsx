import React from "react";
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
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
        backgroundColor: "rgb(47, 39, 39)",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          color: "white",
        }}
      >
        {/* Logo Section */}
        <Box
          component="a"
          href="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            cursor: "pointer",
            userSelect: "none",
            mr: 2,
          }}
        >
          <Box
            component="img"
            src="https://png.pngtree.com/png-clipart/20230103/original/pngtree-vietnam-flag-transparent-watercolor-painted-brush-png-image_8863886.png"
            alt="Eiga Logo"
            sx={{ height: 40 }}
          />
        </Box>

        {/* Stepper Section */}
        <Stepper activeStep={currentStep - 1} alternativeLabel sx={{ flex: 1 }}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                // If you have a custom StepIconComponent, you can also style it here
                StepIconComponent={() => (
                  <Box sx={{ color: index < currentStep ? "#834bff" : "gray" }}>
                    {step.icon}
                  </Box>
                )}
                sx={{
                  // Force the label text color for all states
                  "& .MuiStepLabel-label": {
                    color: "gray", // default color
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: "white !important", // active step color
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: "white !important", // completed step color
                  },
                  "& .MuiStepLabel-label.Mui-disabled": {
                    color: "gray !important", // disabled step color
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
