import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { format, addDays } from "date-fns";
import { vi as viLocale } from "date-fns/locale";
import axios from "axios";
import { ShowTime } from "../../types/showtime.types";
import { Cinema } from "../../types/cinema.types";

interface ShowTimeCinemaProps {
  movieId: string;
  onRoomSelect: (roomId: string) => void;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

const ShowTimeCinema: React.FC<ShowTimeCinemaProps> = ({
  movieId,
  onRoomSelect,
  onSelectDate,
  onSelectTime,
}) => {
  const today = new Date();
  const todayFormatted = format(today, "dd/MM");

  const [selectedDate, setSelectedDate] = useState<string>(todayFormatted);
  const [selectedCity, setSelectedCity] = useState<string>("hcm");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  // Generate an array of 4 days: today plus the next 3 days.
  const days = Array.from({ length: 4 }, (_, i) => {
    const date = addDays(today, i);
    return {
      date,
      formatted: format(date, "dd/MM"),
      label: format(date, "EEEE", { locale: viLocale }),
    };
  });

  // When the user selects a date, update both local and parent state.
  const handleDateChange = (e: any, newDate: string) => {
    if (newDate) {
      setSelectedDate(newDate);
      onSelectDate(newDate);
    }
  };

  // Fetch showtimes when city or date changes.
  useEffect(() => {
    const selectedDay = days.find((day) => day.formatted === selectedDate);
    if (!selectedDay) return;

    const fromDate = format(selectedDay.date, "yyyy-MM-dd");
    const toDate = format(addDays(selectedDay.date, 1), "yyyy-MM-dd");
    const apiKey = `${fromDate}T00:00:00`;

    const fetchShowtimes = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7119/api/ShowTime/GetShowTimeByDates?movieId=${movieId}&fromDate=${fromDate}&toDate=${toDate}`
        );
        const showtimes: ShowTime[] = response.data.data[apiKey] || [];
        if (showtimes.length === 0) {
          setCinemas([]);
          return;
        }

        const dummyCinema: Cinema = {
          name: "Cinema Eiga",
          address:
            "S10.06 Origami, Vinhomes Grandpark, Thủ Đức, Hồ Chí Minh",
          times: showtimes.map((show) => ({
            time: format(new Date(show.startTime), "HH:mm"),
            roomId: show.roomId,
          })),
        };

        setCinemas([dummyCinema]);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, [selectedCity, selectedDate, days, movieId]);

  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white", py: 5 }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          fontFamily="JetBrains Mono"
          mb={2}
          sx={{ letterSpacing: "1px", textTransform: "uppercase" }}
        >
          Lịch Chiếu & Rạp
        </Typography>

        {/* Date Selection */}
        <ToggleButtonGroup
          value={selectedDate}
          exclusive
          onChange={handleDateChange}
          sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}
        >
          {days.map((day, index) => {
            const isToday = day.formatted === todayFormatted;
            return (
              <ToggleButton
                key={index}
                value={day.formatted}
                sx={{
                  border: "2px solid yellow !important",
                  color: "yellow",
                  backgroundColor:
                    selectedDate === day.formatted ? "yellow" : "transparent",
                  "&.Mui-selected": {
                    backgroundColor: "yellow",
                    color: "#834bff",
                    fontWeight: "bold",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "yellow",
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                  borderRadius: "12px",
                  px: 3,
                  py: 2,
                  minWidth: "100px",
                  position: "relative",
                }}
              >
                {isToday && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "4px",
                      px: 0.5,
                      fontWeight: "bold",
                    }}
                  >
                    Today
                  </Typography>
                )}
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={1}
                    fontFamily="JetBrains Mono"
                  >
                    {day.formatted}
                  </Typography>
                  <Typography variant="body2">{day.label}</Typography>
                </Box>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>

        {/* City Selection */}
        <Grid container alignItems="center" justifyContent="space-between" mb={3}>
          <Grid item>
            <Typography variant="h4" fontWeight="bold">
              🎬 Danh Sách Rạp
            </Typography>
          </Grid>
          <Grid item>
            <FormControl>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                sx={{
                  border: "2px solid yellow",
                  color: "yellow",
                  fontWeight: "bold",
                  fontSize: "15px",
                  borderRadius: "10px",
                  px: 3,
                  backgroundColor: "transparent",
                }}
              >
                <MenuItem value="hcm">Hồ Chí Minh</MenuItem>
                <MenuItem value="hn">Hà Nội</MenuItem>
                <MenuItem value="dn">Đà Nẵng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Cinema List or No Showtime Message */}
        <Box sx={{ borderRadius: "12px" }}>
          {cinemas.length > 0 ? (
            cinemas.map((cinema, index) => (
              <Card
                key={index}
                sx={{
                  backgroundColor: "#834bff",
                  color: "white",
                  borderRadius: "12px",
                  p: 2,
                  mb: 2,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="yellow"
                    mb={1}
                    fontFamily="JetBrains Mono"
                  >
                    {cinema.name}
                  </Typography>
                  <Typography variant="body2" mb={2}>
                    {cinema.address}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {cinema.times.map((showtime, idx) => (
                      <Button
                        key={idx}
                        variant="contained"
                        sx={{
                          backgroundColor:
                            selectedTime === showtime.time ? "yellow" : "transparent",
                          color: selectedTime === showtime.time ? "black" : "white",
                          border: "1px solid white",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor: "yellow",
                            color: "black",
                          },
                        }}
                        onClick={() => {
                          setSelectedTime(showtime.time);
                          onSelectTime(showtime.time);
                          onRoomSelect(showtime.roomId);
                        }}
                      >
                        {showtime.time}
                      </Button>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" textAlign="center" sx={{ py: 5 }}>
              Không có suất chiếu cho ngày được chọn.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ShowTimeCinema;
