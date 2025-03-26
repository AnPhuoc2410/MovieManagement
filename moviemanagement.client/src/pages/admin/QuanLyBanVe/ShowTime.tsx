import {
  Box,
  CssBaseline,
  Stack,
  Typography,
  Paper,
  Container
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import MovieAdminDetail from "../../../components/admin/AdminMovieDetail";
import ShowTimeCinema from "../../../components/admin/ShowTimeCinema";
import TicketPrice from "../../../components/admin/TicketPrice";
import { SeatType } from "../../../types/seattype.types";
import { useTranslation } from "react-i18next";

const ShowTime: React.FC = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { t } = useTranslation();
  const [movieData, setMovieData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimeId, setShowTimeId] = useState<string>("");
  const [showTicketPrice, setShowTicketPrice] = useState<boolean>(false);
  const [disableCustomTheme] = useState<boolean>(false);

  // Memoized callbacks
  const handleRoomSelect = useCallback((showTimeId: string) => {
    setShowTimeId(showTimeId);
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const handleShowtimeAvailability = useCallback((available: boolean) => {
    setShowTicketPrice(available);
  }, []);

  const handleMovieLoad = useCallback((movie: any) => {
    setMovieData(movie);
  }, []);

  const handleTicketSelection = useCallback(
    (tickets: SeatType[]) => {
      if (!selectedTime) {
        toast.error("Vui lòng chọn suất chiếu!");
        return;
      }
      const totalTickets = tickets.reduce(
        (sum, t) => sum + (t.quantity || 0),
        0,
      );
      if (totalTickets === 0) {
        toast.error("Vui lòng chọn ít nhất 1 vé!");
        return;
      }
      navigate("/admin/ql-ban-ve/movie-seat", {
        state: {
          movieId,
          showTimeId,
          selectedDate,
          selectedTime,
          tickets,
          movieData,
        },
      });
    },
    [movieId, navigate, showTimeId, selectedDate, selectedTime, movieData],
  );

  if (!movieId) {
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
              <Stack spacing={3}>
                <Header />
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px'
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                    {t("oops")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      p: 4,
                      border: 2,
                      borderColor: "error.main",
                      color: "error.main",
                      borderRadius: 2,
                      textAlign: 'center'
                    }}
                  >
                    Phim không tồn tại.
                  </Typography>
                </Paper>
              </Stack>
            </Box>
          </Box>
        </Box>
      </AppTheme>
    );
  }

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
            <Stack spacing={3}>
              <Header />

              <Paper
                elevation={2}
                sx={{
                  width: '100%',
                  borderRadius: 2
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Đặt Vé Xem Phim
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  {/* Movie details */}
                  <Paper
                    elevation={1}
                    sx={(theme) => ({
                      backgroundColor: alpha(theme.palette.background.default, 0.6),
                      p: 3,
                      mb: 3
                    })}
                  >
                    <MovieAdminDetail onMovieLoad={handleMovieLoad} />
                  </Paper>

                  {/* ShowTimeCinema component for picking date, time, and room */}
                  <Paper
                    elevation={1}
                    sx={(theme) => ({
                      backgroundColor: alpha(theme.palette.background.default, 0.6),
                      p: 3,
                      mb: 3
                    })}
                  >
                    <ShowTimeCinema
                      movieId={movieId}
                      onRoomSelect={handleRoomSelect}
                      onSelectDate={handleDateSelect}
                      onSelectTime={handleTimeSelect}
                      onShowtimeAvailability={handleShowtimeAvailability}
                    />
                  </Paper>

                  {/* Only render TicketPrice when needed */}
                  {showTicketPrice && (
                    <Paper
                      elevation={1}
                      sx={(theme) => ({
                        backgroundColor: alpha(theme.palette.background.default, 0.6),
                        p: 3,
                      })}
                    >
                      <TicketPrice onNext={handleTicketSelection} />
                    </Paper>
                  )}
                </Box>
              </Paper>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ShowTime;
