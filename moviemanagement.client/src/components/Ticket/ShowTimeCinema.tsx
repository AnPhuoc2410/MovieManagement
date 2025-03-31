import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { addDays, format } from "date-fns";
import { vi as viLocale } from "date-fns/locale";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../apis/axios.config";
import { Cinema } from "../../types/cinema.types";
import { ShowTime } from "../../types/showtime.types";
import { Theater } from "../../types/theater.types";

interface ShowTimeCinemaProps {
  movieId: string;
  onRoomSelect: (showTimeId: string) => void;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onShowtimeAvailability: (available: boolean) => void;
}

// Cache object to store fetched data
const showtimesCache = new Map<string, Cinema[]>();

const ShowTimeCinema: React.FC<ShowTimeCinemaProps> = ({
  movieId,
  onRoomSelect,
  onSelectDate,
  onSelectTime,
  onShowtimeAvailability,
}) => {
  const today = new Date();
  const todayFormatted = format(today, "dd/MM");

  const [selectedDate, setSelectedDate] = useState<string>(todayFormatted);
  const [selectedCity, setSelectedCity] = useState<string>("hcm");
  const [selectedShowtime, setSelectedShowtime] = useState<{ time: string, id: string } | null>(null);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const lastAvailabilityRef = useRef<boolean | null>(null);


  const days = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const date = addDays(today, i);
      const dayName = format(date, "EEEE", {
        locale: i18n.language === "vi" ? viLocale : undefined,
      });
      return {
        date,
        formatted: format(date, "dd/MM"),
        label: t(`${dayName.toLowerCase()}`),
      };
    });
  }, [today, t, i18n.language]);

  const handleDateChange = useCallback(
    (e: any, newDate: string) => {
      if (newDate) {
        setSelectedDate(newDate);
        onSelectDate(newDate);
        setSelectedShowtime(null);
      }
    },
    [onSelectDate],
  );

  const getFromCache = (key: string) => {
    const data = showtimesCache.get(key);
    return data;
  };

  useEffect(() => {
    onSelectDate(todayFormatted);
  }, [onSelectDate, todayFormatted]);

  const handleTimeSelect = useCallback(
    (time: string, showTimeId: string) => {
      setSelectedShowtime({ time, id: showTimeId });
      onSelectTime(time);
      onRoomSelect(showTimeId);
      sessionStorage.setItem("currentShowTimeId", showTimeId);
    },
    [onSelectTime, onRoomSelect],
  );

  // Fetch showtimes with caching and error handling for 404
  useEffect(() => {
    const selectedDay = days.find((day) => day.formatted === selectedDate);
    if (!selectedDay) return;

    const fromDate = format(selectedDay.date, "yyyy-MM-dd");
    const toDate = format(addDays(selectedDay.date, 3), "yyyy-MM-dd");
    const dateKey = format(selectedDay.date, "yyyy-MM-dd");

    // Create a cache key based on movie, date and city
    const cacheKey = `${movieId}_${fromDate}_${selectedCity}`;

    // Track if the component is still mounted
    let isMounted = true;

    const fetchShowtimes = async () => {
      // Check cache with enhanced logging
      const cachedData = getFromCache(cacheKey);
      if (cachedData) {
        if (isMounted) {
          setCinemas(cachedData);
          setIsLoading(false);
          onShowtimeAvailability(cachedData.length > 0);
        }
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(
          `showtime/getshowtimebydates?movieId=${movieId}&fromDate=${fromDate}&toDate=${toDate}&location=${selectedCity.toUpperCase()}`
        );
        if (!isMounted) return;

        const dateData = response.data.data[dateKey];

        if (
          !dateData ||
          !dateData[selectedCity.toUpperCase()] ||
          dateData[selectedCity.toUpperCase()].length === 0
        ) {
          // Cache the empty result
          const emptyResult: Cinema[] = [];
          setCinemas(emptyResult);
          showtimesCache.set(cacheKey, emptyResult);
          onShowtimeAvailability(false);
          return;
        }

        const cinemaResults: Cinema[] = dateData[selectedCity.toUpperCase()].map((theater: Theater) => ({
          name: theater.nameTheater,
          address: theater.addressTheater,
          times: theater.listShowTime.map((show: ShowTime) => ({
            time: format(new Date(show.startTime), "HH:mm"),
            showTimeId: show.showTimeId,
          })),
        }));

        const validCinemas = cinemaResults.filter(cinema =>
          cinema.name && cinema.times && cinema.times.length > 0
        );

        // Update state and cache
        setCinemas(validCinemas);
        showtimesCache.set(cacheKey, validCinemas);
        onShowtimeAvailability(validCinemas.length > 0);
      } catch (error: any) {
        const emptyResult: Cinema[] = [];
        setCinemas(emptyResult);
        showtimesCache.set(cacheKey, emptyResult);
        onShowtimeAvailability(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Rest of the effect remains the same
    const timerId = setTimeout(() => {
      fetchShowtimes();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [selectedCity, selectedDate, days, movieId, onShowtimeAvailability]);

  // Update parent about availability whenever cinemas change
  useEffect(() => {
    const isAvailable = cinemas.length > 0;

    // Only notify parent if availability has changed
    if (lastAvailabilityRef.current !== isAvailable) {
      lastAvailabilityRef.current = isAvailable;
      onShowtimeAvailability(isAvailable);
    }
  }, [cinemas.length, onShowtimeAvailability]);

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
          {t("showtime_cinema.title.showtime_list")}
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("showtime_cinema.title.now_day")}
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
              🎬 {t("showtime_cinema.title.theater_list")}
            </Typography>
          </Grid>
          <Grid item>
            <FormControl>
              <Select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value as string);
                  setSelectedShowtime(null);
                }}
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
                <MenuItem value="hcm">{t("showtime_cinema.location.HCM")}</MenuItem>
                <MenuItem value="hn">{t("showtime_cinema.location.HaNoi")}</MenuItem>
                <MenuItem value="bd">{t("showtime_cinema.location.BinhDuong")}</MenuItem>
                <MenuItem value="bp">{t("showtime_cinema.location.BinhPhuoc")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Cinema List or No Showtime Message */}
        {!isLoading && (
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
                              selectedShowtime?.id === showtime.showTimeId
                                ? "yellow"
                                : "transparent",
                            color:
                              selectedShowtime?.id === showtime.showTimeId
                                ? "black"
                                : "white",
                            border: "1px solid white",
                            fontWeight: "bold",
                            "&:hover": {
                              backgroundColor: "yellow",
                              color: "black",
                            },
                          }}
                          onClick={() =>
                            handleTimeSelect(showtime.time, showtime.showTimeId)
                          }
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
                {t("showtime_cinema.title.no_showtime")}
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default React.memo(ShowTimeCinema);
