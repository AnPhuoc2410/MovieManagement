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
import api from "../../../apis/axios.config";

interface MovieApiResponse {
  message: string;
  statusCode: number;
  reason: string | null;
  isSuccess: boolean;
  data: Movie[];
}

interface RoomApiResponse {
  message: string;
  statusCode: number;
  reason: string | null;
  isSuccess: boolean;
  data: Room[];
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
        const response = await api.get("movie/showing/page/1/size/100");
        console.log('Movie API Response:', response.data); // Debug log
        
        // Handle direct data response from showing movies API
        if (response.data && response.data.items) {
          // If the response has paginated structure
          setMovies(response.data.items);
        } else if (Array.isArray(response.data)) {
          // If the response is a direct array
          setMovies(response.data);
        } else if (response.data && response.data.data) {
          // If the response has the wrapper structure
          setMovies(response.data.data);
        } else {
          setMessage({ 
            text: "Không tìm thấy phim nào đang chiếu", 
            type: "error" 
          });
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMessage({ 
          text: "Không thể tải danh sách phim", 
          type: "error" 
        });
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await api.get<RoomApiResponse>("room");
        if (response.data.isSuccess) {
          setRooms(response.data.data);
        } else {
          setMessage({ text: "Failed to load rooms: " + response.data.message, type: "error" });
        }
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
      // Fix timezone issues by keeping the selected time as is without conversion
      const formatDateTime = (dateTimeString: string) => {
        if (!dateTimeString) return "";
        // Create a date object but keep the time as selected by user
        const dt = new Date(dateTimeString);
        // Format date in yyyy-MM-ddTHH:mm:ss format (no timezone conversion)
        return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}T${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}:00`;
      };

      const payload = {
        showTimeId: crypto.randomUUID(),
        movieId: formData.movieId,
        roomId: formData.roomId,
        startTime: formatDateTime(formData.startTime),
        endTime: formatDateTime(formData.endTime),
      };

      console.log('Sending payload:', payload); // Debug log

      const response = await api.post(
        "showtime",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          }
        }
      );

      console.log('Response:', response); // Debug log

      if (response.data && response.data.isSuccess) {
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
        setMessage({
          text: `Failed to create showtime: ${response.data?.message || 'Unknown error'}`,
          type: "error"
        });
      }
    } catch (error: any) {
      console.error("Error creating showtime:", error);
      const errorMessage = error.response?.data?.message
        || error.message
        || "Failed to create showtime. Please try again.";
      setMessage({
        text: errorMessage,
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
