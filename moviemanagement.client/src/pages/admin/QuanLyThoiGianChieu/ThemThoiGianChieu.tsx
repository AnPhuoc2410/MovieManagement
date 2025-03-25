import * as React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import { Movie } from "../../../types/movie.types";
import { Room } from "../../../types/room.types";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface MovieApiResponse {
  message: string;
  statusCode: number;
  reason: string | null;
  isSuccess: boolean;
  data: Movie[];
}

// Component
const ThemThoiGianChieu = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<MovieApiResponse>("https://localhost:7119/api/movie/all");
        if (response.data.isSuccess) {
          setMovies(response.data.data);
        } else {
          setMessage({ text: "Failed to load movies: " + response.data.message, type: "error" });
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMessage({ text: "Failed to load movies", type: "error" });
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get<Room[]>("https://localhost:7119/api/room/all");
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setMessage({ text: "Failed to load rooms", type: "error" });
      }
    };

    fetchMovies();
    fetchRooms();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        showTimeId: crypto.randomUUID(),
        movieId: formData.movieId,
        roomId: formData.roomId,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      const response = await axios.post(
        "https://localhost:7119/api/showtime/createshowtime",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setMessage({
          text: "Thời gian chiếu đã được thêm thành công!",
          type: "success",
        });
        // Reset form
        setFormData({
          movieId: "",
          roomId: "",
          startTime: "",
          endTime: "",
        });
      } else {
        setMessage({ text: "Failed to create showtime", type: "error" });
      }
    } catch (error) {
      console.error("Error creating showtime:", error);
      setMessage({
        text: "Failed to create showtime. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate("/admin/ql-thoi-gian-chieu");
  };

  return (
    <AppTheme>
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
              <Container
                sx={{
                  backgroundColor: "#f5f5f5",
                  color: "#000000",
                  py: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleReturn}
                    sx={{ mr: 2 }}
                  >
                    Quay lại
                  </Button>
                  <Typography variant="h3">Thêm Thời Gian Chiếu</Typography>
                </Box>
                
                {message.text && (
                  <Typography 
                    color={message.type === "error" ? "error" : "success"} 
                    sx={{ mt: 2 }}
                  >
                    {message.text}
                  </Typography>
                )}

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Chọn Phim
                  </Typography>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="movie-select-label">Phim</InputLabel>
                    <Select
                      labelId="movie-select-label"
                      id="movie-select"
                      name="movieId"
                      value={formData.movieId}
                      onChange={handleSelectChange}
                      label="Phim"
                    >
                      {movies.map((movie) => (
                        <MenuItem key={movie.movieId} value={movie.movieId}>
                          {movie.movieName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Chọn Phòng
                  </Typography>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel id="room-select-label">Phòng</InputLabel>
                    <Select
                      labelId="room-select-label"
                      id="room-select"
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleSelectChange}
                      label="Phòng"
                    >
                      {rooms.map((room) => (
                        <MenuItem key={room.roomId} value={room.roomId}>
                          {room.roomName || `Phòng ${room.roomId.substring(0, 8)}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Thời gian bắt đầu
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Thời gian kết thúc
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </Box>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ minWidth: 150 }}
                    onClick={handleReturn}
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ minWidth: 150 }}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Thêm Thời Gian Chiếu"}
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

export default ThemThoiGianChieu;
