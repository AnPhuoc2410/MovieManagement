import { FileUploadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import { useNavigate } from "react-router-dom";

const ThemVeMoi: React.FC = ({ disableCustomTheme = false }: { disableCustomTheme?: boolean }) => {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState({
    movieName: "",
    buyerName: "",
    showDate: "",
    showTime: "",
    price: "",
    room: "",
    ticketType: "2D",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Submitting ticket:", ticketData);
    try {
      const response = await fetch("https://67d7d3cf9d5e3a10152c2879.mockapi.io/api/ticketdetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) throw new Error("Failed to add ticket");
      alert("Vé mới đã được thêm thành công!");
      navigate("/admin/ban-ve");
    } catch (error) {
      console.error("Error adding ticket:", error);
    }
  };

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SideMenu />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppNavbar />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflowY: "auto",
              px: 3,
              py: 2,
            })}
          >
            <Stack spacing={2} alignItems="center">
              <Header />
              <Container sx={{ backgroundColor: "#f5f5f5", color: "#000000", py: 3 }}>
                <Typography variant="h3" fontWeight="bold">
                  Thêm vé mới
                </Typography>

                {/* Tên phim */}
                <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: "right" }}>
                    Tên phim
                  </Typography>
                  <TextField fullWidth name="movieName" variant="outlined" size="small" onChange={handleChange} />
                </Box>

                {/* Người mua */}
                <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: "right" }}>
                    Người mua
                  </Typography>
                  <TextField fullWidth name="buyerName" variant="outlined" size="small" onChange={handleChange} />
                </Box>

                {/* Ngày chiếu */}
                <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: "right" }}>
                    Ngày chiếu
                  </Typography>
                  <TextField fullWidth type="date" name="showDate" variant="outlined" size="small" onChange={handleChange} />
                </Box>

                {/* Giờ chiếu */}
                <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: "right" }}>
                    Giờ chiếu
                  </Typography>
                  <TextField fullWidth type="time" name="showTime" variant="outlined" size="small" onChange={handleChange} />
                </Box>

                {/* Giá vé */}
                <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: "right" }}>
                    Giá vé
                  </Typography>
                  <TextField fullWidth type="number" name="price" variant="outlined" size="small" onChange={handleChange} />
                </Box>

                {/* Phòng chiếu */}
                <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: "right" }}>
                    Phòng chiếu
                  </Typography>
                  <TextField fullWidth name="room" variant="outlined" size="small" onChange={handleChange} />
                </Box>

                {/* Loại vé */}
                <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ minWidth: 120, textAlign: "right" }}>
                    Loại vé
                  </Typography>
                  <RadioGroup row name="ticketType" value={ticketData.ticketType} onChange={handleChange}>
                    <FormControlLabel value="2D" control={<Radio />} label="2D" />
                    <FormControlLabel value="3D" control={<Radio />} label="3D" />
                  </RadioGroup>
                </Box>

                {/* Submit Button */}
                <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                  <Button variant="contained" color="primary" size="large" sx={{ minWidth: 200 }} onClick={handleSubmit}>
                    Thêm vé
                  </Button>
                </Box>
              </Container>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ThemVeMoi;
