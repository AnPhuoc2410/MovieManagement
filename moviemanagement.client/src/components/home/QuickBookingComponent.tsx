import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { TFunction } from "i18next";
import { useState } from "react";

interface QuickBookingComponentProps {
  t: TFunction;
}

const QuickBookingComponent = ({ t }: QuickBookingComponentProps) => {
  // State for all selection fields
  const [theater, setTheater] = useState("");
  const [movie, setMovie] = useState("");
  const [date, setDate] = useState("");
  const [showtime, setShowtime] = useState("");

  // Handlers for each selection change
  const handleTheaterChange = (event: SelectChangeEvent) =>
    setTheater(event.target.value);
  const handleMovieChange = (event: SelectChangeEvent) =>
    setMovie(event.target.value);
  const handleDateChange = (event: SelectChangeEvent) =>
    setDate(event.target.value);
  const handleShowtimeChange = (event: SelectChangeEvent) =>
    setShowtime(event.target.value);

  // Handler for form submission
  const handleSubmit = () => {
    console.log("Booking details:", { theater, movie, date, showtime });
    // Add your booking logic here
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ECF2FF",
        borderRadius: 1,
        p: { xs: 2, sm: 2.5, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        margin: "0 auto",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        gap: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: { xs: 1, md: 0 },
          mr: { md: 3 },
          minWidth: { md: "120px" },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="#464545"
          noWrap
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "h5.fontSize" },
          }}
        >
          {t("quick_booking")}
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ flex: 1 }}>
        <Grid item xs={12} sm={6} md={2.2}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              id="select-theater-label"
              sx={{ color: "#834BFF", fontWeight: "bold" }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventSeatIcon sx={{ mr: 1, fontSize: 18 }} />
                {t("select_theater")}
              </Box>
            </InputLabel>
            <Select
              labelId="select-theater-label"
              id="select-theater"
              value={theater}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EventSeatIcon sx={{ mr: 1, fontSize: 18 }} />
                  {t("select_theater")}
                </Box>
              }
              onChange={handleTheaterChange}
            >
              <MenuItem value="theater1">{t("select_theater1")}</MenuItem>
              <MenuItem value="theater2">{t("select_theater2")}</MenuItem>
              <MenuItem value="theater3">{t("select_theater3")}</MenuItem>
              <MenuItem value="theater4">{t("select_theater4")}</MenuItem>
              <MenuItem value="theater5">{t("select_theater5")}</MenuItem>
              <MenuItem value="theater6">{t("select_theater6")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.2}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              id="select-movie-label"
              sx={{ color: "#834BFF", fontWeight: "bold" }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalMoviesIcon sx={{ mr: 1, fontSize: 18 }} />
                {t("select_movie")}
              </Box>
            </InputLabel>
            <Select
              labelId="select-movie-label"
              id="select-movie"
              value={movie}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocalMoviesIcon sx={{ mr: 1, fontSize: 18 }} />
                  {t("select_movie")}
                </Box>
              }
              onChange={handleMovieChange}
              disabled={!theater}
            >
              <MenuItem value="movie1">Dune: Part Two</MenuItem>
              <MenuItem value="movie2">The Batman</MenuItem>
              <MenuItem value="movie3">Avengers: Secret Wars</MenuItem>
              <MenuItem value="movie4">Tenet</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.2}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              id="select-date-label"
              sx={{ color: "#834BFF", fontWeight: "bold" }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
                {t("select_date")}
              </Box>
            </InputLabel>
            <Select
              labelId="select-date-label"
              id="select-date"
              value={date}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />
                  {t("select_date")}
                </Box>
              }
              onChange={handleDateChange}
              disabled={!movie}
            >
              <MenuItem value="date1">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>Thứ 2</span>
                  <Chip label="07/03" size="small" />
                </Box>
              </MenuItem>
              <MenuItem value="date2">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>Thứ 3</span>
                  <Chip label="08/03" size="small" />
                </Box>
              </MenuItem>
              <MenuItem value="date3">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>Thứ 4</span>
                  <Chip label="09/03" size="small" />
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2.2}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel
              id="select-showtime-label"
              sx={{ color: "#834BFF", fontWeight: "bold" }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ mr: 1, fontSize: 18 }} />
                {t("select_show_time")}
              </Box>
            </InputLabel>
            <Select
              labelId="select-showtime-label"
              id="select-showtime"
              value={showtime}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon sx={{ mr: 1, fontSize: 18 }} />
                  {t("select_show_time")}
                </Box>
              }
              onChange={handleShowtimeChange}
              disabled={!date}
            >
              <MenuItem value="time1">
                <Chip
                  label="09:30"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ minWidth: "70px" }}
                />
              </MenuItem>
              <MenuItem value="time2">
                <Chip
                  label="13:15"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ minWidth: "70px" }}
                />
              </MenuItem>
              <MenuItem value="time3">
                <Chip
                  label="18:45"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ minWidth: "70px" }}
                />
              </MenuItem>
              <MenuItem value="time4">
                <Chip
                  label="21:30"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ minWidth: "70px" }}
                />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3.2}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              height: "40px",
              borderRadius: 1,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              backgroundColor: "#834BFF",
              "&:hover": {
                backgroundColor: "#6B3FBF",
              },
            }}
            disabled={!theater || !movie || !date || !showtime}
            onClick={handleSubmit}
          >
            {t("book_now")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuickBookingComponent;
