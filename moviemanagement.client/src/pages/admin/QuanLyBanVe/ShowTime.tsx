import {
  Box,
  CssBaseline,
  Stack,
  Typography,
  Paper,
  Container,
  Button
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
import { useTranslation } from "react-i18next";

const ShowTime: React.FC = () => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const { t } = useTranslation();
  const [movieData, setMovieData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimeId, setShowTimeId] = useState<string>("");
  const [showProceedButton, setShowProceedButton] = useState<boolean>(false);
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
    setShowProceedButton(available);
  }, []);

  const handleMovieLoad = useCallback((movie: any) => {
    setMovieData(movie);
  }, []);

  const handleProceedToSeatSelection = useCallback(() => {
    if (!selectedTime) {
      toast.error(t("toast.error.showtime.selection"));
      return;
    }

    navigate("/admin/ql-ban-ve/movie-seat", {
      state: {
        movieId,
        showTimeId,
        selectedDate,
        selectedTime,
        movieData,
      },
    });
  }, [movieId, navigate, showTimeId, selectedDate, selectedTime, movieData, t]);

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
                    {t("admin.ticket_management.not_existing")}
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
                    {t("menu.breadcrumbs.ticketBooking")}
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

                  {/* Proceed to seat selection button */}
                  {showProceedButton && (
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={handleProceedToSeatSelection}
                          sx={{ minWidth: 200 }}
                        >
                          {t("admin.ticket_management.continue")}
                        </Button>
                      </Box>
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
