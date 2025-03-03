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
    <AppBar position="fixed" sx={{ backgroundColor: "rgb(47, 39, 39)", padding: 1 }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Logo */}
        <Box
          component="a"
          href="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Box
            component="img"
            src="https://png.pngtree.com/png-clipart/20230103/original/pngtree-vietnam-flag-transparent-watercolor-painted-brush-png-image_8863886.png"
            alt="Eiga Logo"
            sx={{ height: 40 }}
          />
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
            "& .MuiStepLabel-label.Mui-completed": { color: "white !important" },
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
