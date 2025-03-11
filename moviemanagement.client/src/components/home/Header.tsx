import { AccountCircleOutlined, FastfoodOutlined } from "@mui/icons-material";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../common/LanguageSelector";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated, authLogout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  // Profile dropdown menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authLogout();
    handleClose();
    navigate("/");
  };

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
                ml: { md: 1 },
                px: { xs: 2, sm: 3 },
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
                px: { xs: 1, md: 4 },
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
                flexGrow: 0,
                flexShrink: 1,
                justifyContent: "center",
                borderRadius: 20,
                border: "none",
                ml: { lg: 4 },
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder={t("search")}
                sx={{
                  backgroundColor: "white",
                  width: { md: "200px", lg: "300px" },
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

            {/* Conditional Login Button or Profile Dropdown */}
            {isAuthenticated ? (
              <>
                <Box
                  onClick={handleProfileClick}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#834bff",
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography>{t("user.profile.my_account")}</Typography>
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  id="profile-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    <PersonIcon fontSize="small" sx={{ mr: 2 }} />
                    {t("user.profile.my_profile")}
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/settings")}>
                    <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
                    {t("user.profile.settings")}
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/bookings")}>
                    <LocalActivityOutlinedIcon
                      fontSize="small"
                      sx={{ mr: 2 }}
                    />
                    {t("user.profile.my_bookings")}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
                    {t("user.profile.logout")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
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
            )}

            {/* Language Selector */}
            <LanguageSelector />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
