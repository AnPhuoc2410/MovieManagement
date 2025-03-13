import {
  Cancel,
  CancelOutlined,
  CheckCircleOutline as CheckCircleIcon,
  EventSeatOutlined as EventSeatIcon,
  MovieOutlined as MovieIcon,
  PaymentOutlined as PaymentIcon,
} from "@mui/icons-material";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

interface StepTrackerProps {
  currentStep: number;
  paymentStatus?: "success" | "failure";
}

const StepTracker: React.FC<StepTrackerProps> = ({
  currentStep,
  paymentStatus,
}) => {
  const finalStep =
    paymentStatus === "success"
      ? { label: "Thành Công", icon: <CheckCircleIcon /> }
      : { label: "Hủy Thanh Toán", icon: <CancelOutlined sx={{ color: 'red' }} /> };

  const { t } = useTranslation();
  const steps = [
    { label: t("step_tracker.select_show_time"), icon: <MovieIcon /> },
    { label: t("step_tracker.select_seat"), icon: <EventSeatIcon /> },
    { label: t("step_tracker.payment"), icon: <PaymentIcon /> },
    { label: t("step_tracker.success"), icon: <CheckCircleIcon /> },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "rgba(18, 18, 18, 0.8)",
        backdropFilter: "blur(8px)",
        borderRadius: "12px",
        mt: 10,
        padding: 3,
        height: "fit-content",
        position: "relative",
        transition: "all 0.3s ease",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stepper
        activeStep={currentStep - 1}
        orientation="vertical"
        sx={{
          "& .MuiStepConnector-line": {
            minHeight: "40px",
            borderLeftColor: "rgba(255, 255, 255, 0.2)",
            transition: "border-color 0.3s ease",
          },
          "& .MuiStepLabel-label": {
            color: "gray",
            fontSize: "0.9rem",
            marginLeft: 1,
            transition: "color 0.3s ease",
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: "white !important",
            fontWeight: "bold",
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: "white !important",
          },
          "& .MuiStepLabel-iconContainer": {
            paddingRight: 0,
          },
          "& .MuiStep-root": {
            transition: "all 0.3s ease",
            "&:hover": {
              "& .MuiStepLabel-label": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            },
          },
        }}
      >
        {[...steps, finalStep].map((step, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={() => (
                <Box
                  sx={{
                    color: index < currentStep ? "#834bff" : "gray",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.3s ease",
                  }}
                >
                  {step.icon}
                </Box>
              )}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepTracker;
