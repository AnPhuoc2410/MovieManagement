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
import ShowTime from "../../../components/Ticket/ShowTime";
import ListCinema from "../../../components/Ticket/ListCinema";
import TicketPrice, {
  TicketType,
} from "../../../components/Ticket/TicketPrice";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface BuyTicketProps {
  disableCustomTheme?: boolean;
}

export default function BuyTicket({
  disableCustomTheme = false,
}: BuyTicketProps) {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), "dd/MM"),
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
    navigate("/movie-seat", {
      state: {
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
              <Container sx={{ py: 4 }}>
                <MovieDetail />
                <ShowTime
                  selectedDate={selectedDate}
                  onDateChange={(newDate) => setSelectedDate(newDate)}
                />
                <ListCinema
                  selectedTime={selectedTime}
                  onTimeSelect={(time: string) => setSelectedTime(time)}
                />
                <TicketPrice onNext={handleTicketSelection} />
              </Container>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
