import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";

// Components
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";

// Theme & Customizations
import AppTheme from "../../../shared-theme/AppTheme";

import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MovieDetail from "../../../components/Movie/MovieDetail";
import ShowTimeCinema from "../../../components/Ticket/ShowTimeCinema";
import TicketPrice, {
  TicketType,
} from "../../../components/Ticket/TicketPrice";
import toast from "react-hot-toast";

interface BuyTicketProps {
  disableCustomTheme?: boolean;
}

export default function BuyTicket({
  disableCustomTheme = false,
}: BuyTicketProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // movieId could come from props, context, or elsewhere. For now we hardcode it.
  const movieId = "321fb7db-6361-4c64-8e16-fedfec9736a4";

  const handleTicketSelection = (tickets: TicketType[]) => {
    // Validate that a showtime is selected
    if (!selectedTime) {
      toast.error("Vui lòng chọn suất chiếu!");
      return;
    }
    // Validate that at least one ticket is selected
    const totalTickets = tickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
    if (totalTickets === 0) {
      toast.error("Vui lòng chọn ít nhất 1 vé!");
      return;
    }
    navigate("/ticket/movie-seat", {
      state: {
        movieId,
        selectedDate,
        selectedTime,
        tickets,
      },
    });
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
              <Container
                sx={{
                  paddingTop: { xs: "80px", sm: "90px", md: "100px" },
                  position: "relative",
                  zIndex: 1,
                  px: { xs: 2, sm: 3, md: 4 },
                }}
              >
                <Box sx={{ color: "white", mb: 3, mt: 2 }}>
                  {/* Movie details */}
                  <MovieDetail />

                  {/* ShowTime component for picking date and time */}
                  <ShowTimeCinema
                    movieId={movieId}
                    onSelectDate={(date: string) => setSelectedDate(date)}
                    onSelectTime={(time: string) => setSelectedTime(time)}
                  />

                  {/* TicketPrice for selecting ticket types/quantities */}
                  <TicketPrice onNext={handleTicketSelection} />
                </Box>
              </Container>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
