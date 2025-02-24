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
  Typography
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../common/LanguageSelector";

const Header: React.FC = () => {
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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo - Fixed Cursor Issue */}
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

        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder={t("search")} 
            sx={{ backgroundColor: "white", borderRadius: 2, width: "70%" }}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>

        {/* Right Icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
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
          >
            <span>{t("book_ticket")}</span>
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
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
            startIcon={<ShoppingCartIcon />}
          >
            <span>{t("book_snacks")}</span>
          </Button>
          <IconButton color="inherit" onClick={() => navigate("/auth")}>
            <AccountCircleIcon />
            <Typography>{t("login")}</Typography>
          </IconButton>
          <LanguageSelector />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
