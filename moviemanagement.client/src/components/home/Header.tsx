import { AccountCircleOutlined, FastfoodOutlined } from "@mui/icons-material";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../common/LanguageSelector";

const Header: React.FC = () => {
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

          {/* Right Icons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2, md: 3 },
              flex: 1,
              justifyContent: "flex-end",
              maxWidth: { md: "calc(100% - 100px)" },
            }}
          >
            {/* Book Ticket Button */}
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{
                display: { xs: "none", md: "flex" },
                fontWeight: "bold",
                position: "relative",
                overflow: "hidden",
                bgcolor: "yellow",
                color: "black",
                transition: "color 0.5s ease-in-out",
                minWidth: "auto",
                px: 2,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, #e67e22,rgb(77, 91, 185))",
                  transform: "translateX(-100%)",
                  transition: "transform 0.5s ease-in-out",
                  zIndex: 0,
                },
                "&:hover": {
                  color: "white",
                },
                "&:hover::before": {
                  transform: "translateX(0)",
                },
                "& span": {
                  position: "relative",
                  zIndex: 1,
                  whiteSpace: "nowrap",
                },
              }}
              startIcon={<LocalActivityOutlinedIcon />}
            >
              <span>{t("book_ticket")}</span>
            </Button>

            {/* Book Snacks Button */}
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              sx={{
                display: { xs: "none", md: "flex" },
                fontWeight: "bold",
                position: "relative",
                overflow: "hidden",
                bgcolor: "#834bff",
                color: "white",
                transition: "color 0.5s ease-in-out",
                minWidth: "auto",
                px: 2,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, #e67e22,rgb(77, 91, 185))",
                  transform: "translateX(-100%)",
                  transition: "transform 0.5s ease-in-out",
                  zIndex: 0,
                },
                "&:hover": {
                  color: "black",
                },
                "&:hover::before": {
                  transform: "translateX(0)",
                },
                "& span": {
                  position: "relative",
                  zIndex: 1,
                  whiteSpace: "nowrap",
                },
              }}
              startIcon={<FastfoodOutlined />}
            >
              <span>{t("book_snacks")}</span>
            </Button>

            {/* Search Bar */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
                flexGrow: 0,
                flexShrink: 1,
                justifyContent: "center",
                borderRadius: 20,
                border: "none",
                ml: { md: 2, lg: 4 },
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder={t("search")}
                sx={{
                  backgroundColor: "white",
                  width: { md: "250px", lg: "300px" },
                  border: 0,
                  borderRadius: "20px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    "& fieldset": {
                      borderRadius: "20px",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small">
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            {/* Mobile Menu Icon */}
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
