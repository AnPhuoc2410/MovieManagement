import React from "react";
import { AppBar, Toolbar, Button, TextField, IconButton, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VietnamFlag from '../../assets/vietnam-icon.svg';

const Header: React.FC = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#0B0D1A", padding: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Box component="img" src="https://png.pngtree.com/png-clipart/20230103/original/pngtree-vietnam-flag-transparent-watercolor-painted-brush-png-image_8863886.png" alt="Cinestar Logo" sx={{ height: 40 }} />
        
        {/* Search Bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, justifyContent: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm phim, rạp"
            sx={{ backgroundColor: "white", borderRadius: 2, width: 300 }}
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
          <Button variant="contained" sx={{ backgroundColor: "#FFD700", color: "black" }}>
            ĐẶT VÉ NGAY
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "#8A2BE2" }} startIcon={<ShoppingCartIcon />}>
            ĐẶT BẮP NƯỚC
          </Button>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
          <Typography>Đăng nhập</Typography>
          <IconButton color="inherit">
          <img src={VietnamFlag} alt="Vietnam Flag" width="25" height="25" />
          </IconButton>
          <Typography>VN ▼</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
