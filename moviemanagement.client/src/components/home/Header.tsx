import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../common/LanguageSelector";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import { AccountCircleOutlined, FastfoodOutlined } from "@mui/icons-material";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      sx={{
        position: "fixed",
        backgroundColor: isScrolled ? "rgb(26, 30, 60)" : "transparent",
        backdropFilter: isScrolled ? "blur(8px)" : "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease-in-out",
        padding: 1,
        boxShadow: isScrolled ? 2 : "none",
        zIndex: 10,
        height: "80px",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          minWidth: "1200px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
            src="/favicon/apple-touch-icon.png"
            alt="Eiga Logo"
            sx={{ height: 50 }}
          />
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
              fontWeight: "bold",
              position: "relative",
              overflow: "hidden",
              bgcolor: "yellow",
              color: "black",
              transition: "color 0.5s ease-in-out",
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
              },
            }}
            startIcon={<LocalActivityOutlinedIcon />}
          >
            <span>{t("book_ticket")}</span>
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
              fontWeight: "bold",
              position: "relative",
              overflow: "hidden",
              bgcolor: "#834bff",
              color: "white",
              transition: "color 0.5s ease-in-out",
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
              },
            }}
            startIcon={<FastfoodOutlined />}
          >
            <span>{t("book_snacks")}</span>
          </Button>

          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexGrow: 1,
              justifyContent: "center",
              borderRadius: 20,
              border: "none",
              marginLeft: 40,
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder={t("search")}
              sx={{
                backgroundColor: "white",
                width: "30rem",
                border: 0,
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  "& fieldset": {
                    borderRadius: "20px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>

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
          <LanguageSelector />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
