import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  ListItemIcon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router";
import { VietnamFlag, UsaFlag, JapanFlag } from "../../data/CustomIcons";

const Header: React.FC = () => {
  const [language, setLanguage] = useState("VN");
  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value as string);
  };

  const languages: { [key: string]: { name: string; icon: JSX.Element } } = {
    VN: { name: "Tiếng Việt", icon: <VietnamFlag /> },
    EN: { name: "English", icon: <UsaFlag /> },
    JP: { name: "日本語", icon: <JapanFlag /> },
  };

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
            placeholder="Tìm phim, rạp"
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
            <span> ĐẶT VÉ</span>
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
            <span>ĐẶT BẮP NƯỚC</span>
          </Button>
          <IconButton color="inherit" onClick={() => navigate("/auth")}>
            <AccountCircleIcon />
            <Typography>Đăng nhập</Typography>
          </IconButton>
          <Select
            value={language}
            onChange={handleChange}
            displayEmpty
            renderValue={(selected: string) => (
              <Box display="flex" alignItems="center">
                {languages[selected]?.icon}
              </Box>
            )}
            sx={{
              backgroundColor: "transparent",
              minWidth: "50px",
              border: "none",
              boxShadow: "none", 
              "& .MuiOutlinedInput-notchedOutline": { border: "none" }, 
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            {Object.entries(languages).map(([code, { name, icon }]) => (
              <MenuItem key={code} value={code}>
                <ListItemIcon>{icon}</ListItemIcon>
                <Typography>{name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
