import React from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Movie as MovieIcon,
  EventSeat as EventSeatIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../common/LanguageSelector";

const steps = [
  { label: "Chọn Suất Chiếu", icon: <MovieIcon /> },
  { label: "Chọn Ghế", icon: <EventSeatIcon /> },
  { label: "Thanh Toán", icon: <PaymentIcon /> },
  { label: "Thanh Công", icon: <CheckCircleIcon /> },
];

interface StepTrackerProps {
  currentStep: number;
}

const StepTracker: React.FC<StepTrackerProps> = ({ currentStep }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: "rgb(47, 39, 39)", padding: 1 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            mt: "calc(var(--template-frame-height, 0px) + 4px)",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            p: 1.5,
          }}
        >
          <Box
            component="img"
            src="/favicon/apple-touch-icon.png"
            alt="Eiga Logo"
            sx={{ height: 50, cursor: "pointer" }}
            onClick={() =>
              setTimeout(() => {
                navigate("/");
              }, 1000)
            }
          />
          <Typography variant="h6">Eiga Management</Typography>
        </Box>
        <Stepper
          activeStep={currentStep - 1}
          alternativeLabel
          sx={{
            flexGrow: 1,
            alignItems: "center",
            maxWidth: "75%",
            "& .MuiStepLabel-label": { color: "gray" },
            "& .MuiStepLabel-label.Mui-active": { color: "white !important" },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "white !important",
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel
                StepIconComponent={() => (
                  <Box sx={{ color: index < currentStep ? "#834bff" : "gray" }}>
                    {step.icon}
                  </Box>
                )}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <IconButton color="inherit" onClick={() => navigate("/auth")}>
          <AccountCircleIcon />
          <Typography>{t("login")}</Typography>
        </IconButton>

        <LanguageSelector />
      </Toolbar>
    </AppBar>
  );
};

export default StepTracker;
