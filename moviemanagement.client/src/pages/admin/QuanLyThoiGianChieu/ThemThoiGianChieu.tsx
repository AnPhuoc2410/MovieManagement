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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../../apis/axios.config";
import AdminNowShowingMovies from "../../../components/admin/AdminNowShowingMovies";
import { useTranslation } from "react-i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";

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
  const location = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [openMovieDialog, setOpenMovieDialog] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [movieDuration, setMovieDuration] = useState<number>(0);

  const [formData, setFormData] = useState({
    movieId: "",
    roomId: "",
    startTime: "",
  });

  useEffect(() => {
    // Check if roomId was passed in location state
    if (location.state && location.state.roomId) {
      setFormData((prev) => ({
        ...prev,
        roomId: location.state.roomId,
      }));
    }

    const fetchMovies = async () => {
      try {
        const response = await api.get("movie/showing/page/0/size/100");
        console.log("Movie API Response:", response.data); // Debug log

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
            type: "error",
          });
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMessage({
          text: "Không thể tải danh sách phim",
          type: "error",
        });
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await api.get<RoomApiResponse>("room");
        if (response.data.isSuccess) {
          setRooms(response.data.data);
        } else {
          setMessage({
            text: "Failed to load rooms: " + response.data.message,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
        setMessage({ text: "Failed to load rooms", type: "error" });
      }
    };

    fetchMovies();
    fetchRooms();
  }, [location, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateTimePickerChange = (value: dayjs.Dayjs | null) => {
    if (value) {
      setFormData({
        ...formData,
        startTime: value.format("YYYY-MM-DDTHH:mm"),
      });
    }
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

    // Validate form data
    if (!formData.movieId || !formData.roomId || !formData.startTime) {
      setLoading(false);
      setMessage({
        text: "Vui lòng điền đầy đủ thông tin lịch chiếu",
        type: "error",
      });
      return;
    }

    try {
      // Find the selected movie to get duration
      const selectedMovie = movies.find((m) => m.movieId === formData.movieId);
      if (!selectedMovie) {
        setLoading(false);
        setMessage({
          text: "Không tìm thấy thông tin phim đã chọn",
          type: "error",
        });
        return;
      }

      // Calculate end time based on movie duration
      const startDate = new Date(formData.startTime);
      const durationInMinutes = selectedMovie.duration || 120; // Default to 2 hours if duration is not available
      const endDate = new Date(startDate.getTime() + durationInMinutes * 60000); // Convert minutes to milliseconds

      // Fix timezone issues by keeping the selected time as is without conversion
      const formatDateTime = (dateTime: Date) => {
        if (!dateTime) return "";
        // Format date in yyyy-MM-ddTHH:mm:ss.000Z format (ISO format with UTC designation)
        return `${dateTime.getFullYear()}-${String(dateTime.getMonth() + 1).padStart(2, "0")}-${String(dateTime.getDate()).padStart(2, "0")}T${String(dateTime.getHours()).padStart(2, "0")}:${String(dateTime.getMinutes()).padStart(2, "0")}:00.000Z`;
      };

      const payload = {
        movieId: formData.movieId,
        roomId: formData.roomId,
        startTime: formatDateTime(startDate),
        endTime: formatDateTime(endDate),
      };

      console.log("Sending payload:", payload); // Debug log

      const response = await api.post("showtime", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      });

      console.log("Response:", response); // Debug log

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
        });

        // Invalidate the showtimes query cache to trigger a refresh
        queryClient.invalidateQueries("ThoiGianChieuData");

        // After a short delay to show the success message, navigate back with refresh signal
        setTimeout(() => {
          navigate("/admin/ql-thoi-gian-chieu", {
            state: { refresh: true, message: "Thời gian chiếu đã được thêm thành công!" }
          });
        }, 1500);
      } else {
        setMessage({
          text: `Failed to create showtime: ${response.data?.message || "Unknown error"}`,
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error creating showtime:", error);

      // Log detailed error information
      if (error.response) {
        console.error("Error response:", {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });
      } else if (error.request) {
        console.error("Error request:", error.request);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create showtime. Please try again.";
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

  const handleMovieSelect = (movieId: string) => {
    console.log("Selected movie ID:", movieId);

    // Find the movie object
    const selectedMovie = movies.find((m) => m.movieId === movieId);
    console.log("Selected movie data:", selectedMovie);

    // Set the movie duration with default fallback
    if (selectedMovie) {
      setMovieDuration(selectedMovie.duration || 120); // Default to 120 if no duration
      console.log("Setting duration to:", selectedMovie.duration || 120);
    }

    // Update other state
    setSelectedMovieId(movieId);
    setFormData((prev) => ({
      ...prev,
      movieId: movieId,
    }));
    setOpenMovieDialog(false);
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
                    {t("admin.showtime_management.movie_selection")}
                  </Typography>
                  <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpenMovieDialog(true)}
                      sx={{ flexShrink: 0 }}
                    >
                      Chọn phim
                    </Button>
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        bgcolor: formData.movieId
                          ? alpha("#f5f5f5", 0.8)
                          : "transparent",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: formData.movieId
                          ? "primary.light"
                          : "divider",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: formData.movieId ? "medium" : "normal",
                          color: formData.movieId
                            ? "text.primary"
                            : "text.secondary",
                        }}
                      >
                        {formData.movieId
                          ? movies.find((m) => m.movieId === formData.movieId)
                              ?.movieName || "Phim đã chọn"
                          : "Chưa chọn phim"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Movie Selection Dialog */}
                <Dialog
                  open={openMovieDialog}
                  onClose={() => setOpenMovieDialog(false)}
                  maxWidth="lg"
                  fullWidth
                >
                  <DialogTitle>Chọn phim chiếu</DialogTitle>
                  <DialogContent dividers>
                    <AdminNowShowingMovies
                      onMovieSelect={handleMovieSelect}
                      selectedMovieId={selectedMovieId}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenMovieDialog(false)}>
                      Đóng
                    </Button>
                  </DialogActions>
                </Dialog>
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
                    {t("admin.showtime_management.room_selection")}
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
                          {room.roomName ||
                            `Phòng ${room.roomId.substring(0, 8)}`}
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
                    {t("admin.showtime_management.start_time")}
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      value={
                        formData.startTime ? dayjs(formData.startTime) : dayjs()
                      }
                      onChange={handleDateTimePickerChange}
                      minutesStep={5}
                      views={["year", "month", "day", "hours", "minutes"]}
                    />
                  </LocalizationProvider>
                  <Typography>
                    Stored value:{" "}
                    {formData.startTime == null ? "null" : formData.startTime}
                  </Typography>
                </Box>

                {formData.movieId && (
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
                      sx={{
                        minWidth: 100,
                        textAlign: "right",
                        paddingRight: 2,
                      }}
                    >
                      Thời lượng
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        bgcolor: "#e8f4fd",
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "info.light",
                        color: "text.primary",
                      }}
                    >
                      {movieDuration} phút
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ minWidth: 150 }}
                    onClick={handleReturn}
                    disabled={loading}
                  >
                    {t("admin.showtime_management.cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ minWidth: 150 }}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? t("admin.showtime_management.loading") : t("admin.showtime_management.add_new")}
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
