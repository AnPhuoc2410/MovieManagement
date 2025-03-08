import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Container,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  AccountCircleOutlined as AccountCircleOutlined,
  MovieOutlined as MovieIcon,
  EventSeatOutlined as EventSeatIcon,
  PaymentOutlined as PaymentIcon,
  CheckCircleOutline as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../common/LanguageSelector";
import MenuIcon from "@mui/icons-material/Menu";


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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "rgba(0, 0, 0, 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled ? 2 : "none",
        transition: "all 0.3s ease-in-out",
        padding: { xs: 2, sm: 2.5, md: 3 },
        margin: 0,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: { xs: "56px", sm: "64px", md: "72px" },
            padding: 0,
            margin: 0,
          }}
        >
          {/* Logo */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="https://www.cinestar.com.vn/pictures/moi/9Logo/white-2018.png"
              alt="Logo"
              style={{
                height: "40px",
                objectFit: "contain",
              }}
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
          <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: "white",
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Login Button */}
            <IconButton
              color="inherit"
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
              }}
              onClick={() => navigate("/auth/login")}
            >
              <AccountCircleOutlined />
              <Typography>{t("login")}</Typography>
            </IconButton>

            {/* Language Selector */}
            <LanguageSelector />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default StepTracker;
