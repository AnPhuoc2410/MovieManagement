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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VietnamFlag from "../../assets/vietnam-icon.svg";
import AmericaFlag from "../../assets/usa.svg";
import JapanFlag from "../../assets/japan.svg";
import { useNavigate } from "react-router";

const Header: React.FC = () => {
  const [language, setLanguage] = useState("VN");
  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setLanguage(event.target.value as string);
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
            renderValue={(selected) => <Typography>{selected} ▼</Typography>}
            sx={{ backgroundColor: "#FFFFFF" }}
          >
            <MenuItem value="VN">
              VN
              <IconButton color="inherit">
                <img
                  src={VietnamFlag}
                  alt="Vietnam Flag"
                  width="25"
                  height="25"
                />
              </IconButton>
            </MenuItem>
            <MenuItem value="EN">
              EN
              <IconButton color="inherit">
                <img
                  src={AmericaFlag}
                  alt="America Flag"
                  width="25"
                  height="25"
                />
              </IconButton>
            </MenuItem>
            <MenuItem value="JP">
              JP
              <IconButton color="inherit">
                <img src={JapanFlag} alt="Japan Flag" width="25" height="25" />
              </IconButton>
            </MenuItem>
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
