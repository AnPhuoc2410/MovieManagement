import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedDataGrid from "./CustomizedDataGrid";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import StatCard, { StatCardProps } from "./StatCard";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import api from "../../apis/axios.config";
import Loader from "../shared/Loading";

function calculateTrend(data: number[]): "up" | "down" | "neutral" {
  const first = data[0];
  const last = data[data.length - 1];
  if (last > first) return "up";
  if (last < first) return "down";
  return "neutral";
}

export default function MainGrid() {
  const [totalMembers, setTotalMembers] = useState<number>();
  const [totalMembersLast30Days, setTotalMembersLast30Days] = useState<number[]>([]);
  const [movies, setMovies] = useState<any[]>([]);
  const [moviesLast30Days, setMoviesLast30Days] = useState<number[]>([]);
  const [totalTicketSold, setTotalTicketSold] = useState<number>();
  const [totalTicketSoldLast30Days, setTotalTicketSoldLast30Days] = useState<number[]>([]);
  // const [dashboardOverview, setDashboardOverview] = useState<any>(null);
  const { t } = useTranslation();
  const data: StatCardProps[] = [
    {
      title: t("dashboard.total_users"),
      value: (totalMembers || 0).toString(),
      interval: t("dashboard.card_interval"),
      trend: calculateTrend(totalMembersLast30Days),
      data: totalMembersLast30Days,
    },
    {
      title: t("dashboard.total_movies"),
      value: (movies.length || 0).toString(),
      interval: t("dashboard.card_interval"),
      trend: calculateTrend(moviesLast30Days),
      data: moviesLast30Days,
    },
    {
      title: t("dashboard.ticket_today"),
      value: (totalTicketSold || 0).toString(),
      interval: t("dashboard.card_interval"),
      trend: calculateTrend(totalTicketSoldLast30Days),
      data: totalTicketSoldLast30Days,
    },
  ];

  // const fetchDashboardOverview = async () => {
  //   try {
  //     const response = await api.get("dashboard/overview");
  //     console.log("Dashboard Overview: ", response.data.data);
  //     setDashboardOverview(response.data.data);
  //   } catch (error) {
  //     console.error("Error fetching dashboard overview:", error);
  //   }
  // };

  // Fetch total members
  const fetchTotalMember = async () => {
    try {
      const response = await api.get("dashboard/total-member");
      console.log("Members: ", response.data.data);
      setTotalMembers(response.data.data);
    } catch (error) {
      console.error("Error fetching total members:", error);
    }
  };

  const fetchMemberDailyLast30Days = async () => {
    try {
      const response = await api.get("dashboard/member-daily-last-30-days");
      console.log("Members last 30 days: ", response.data.data);
      setTotalMembersLast30Days(response.data.data);
    } catch (error) {
      console.error("Error fetching total members:", error);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await api.get("movie");
      console.log("Movies: ", response.data.data.length);
      setMovies(response.data.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchMovieDailyLast30Days = async () => {
    try {
      const response = await api.get("dashboard/movies-daily-last-30-days");
      console.log("Movies last 30 days: ", response.data.data);
      setMoviesLast30Days(response.data.data);
    } catch (error) {
      console.error("Error fetching total members:", error);
    }
  };

  const fetchTotalTicketSold = async () => {
    try {
      const response = await api.get("dashboard/total-ticket-sold");
      console.log("Ticket sold: ", response.data.data);
      setTotalTicketSold(response.data.data);
    } catch (error) {
      console.error("Error fetching total members:", error);
    }
  }

  const fetchTicketSoldLast30Days = async () => {
    try {
      const response = await api.get("dashboard/ticket-sold-daily-last-30-days");
      console.log("Ticket sold last 30 days: ", response.data.data);
      setTotalTicketSoldLast30Days(response.data.data);
    } catch (error) {
      console.error("Error fetching total members:", error);
    }
  }

  useEffect(() => {
    fetchTotalMember();
    fetchMemberDailyLast30Days();
    fetchMovies();
    fetchMovieDailyLast30Days();
    fetchTotalTicketSold();
    fetchTicketSoldLast30Days();
  }, []);
  return (
    <>
      {!totalMembers || movies.length == 0 || !totalTicketSold 
      || totalMembersLast30Days.length == 0
      || moviesLast30Days.length == 0
      || totalMembersLast30Days.length == 0 ? (
        <Loader />
      ) : (
        <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
          {/* cards */}
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            {t("dashboard.title")}
          </Typography>
          <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
            {data.map((card, index) => (
              <Grid key={index} size={{ sm: 12, lg: 4 }}>
                <StatCard {...card} />
              </Grid>
            ))}
            <Grid size={{ xs: 12, md: 6 }}>
              <SessionsChart />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <PageViewsBarChart />
            </Grid>
          </Grid>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Details
          </Typography>
          <Grid container spacing={2} columns={12}>
            <Grid size={{ xs: 12, lg: 9 }}>
              <CustomizedDataGrid />
            </Grid>
            <Grid size={{ xs: 12, lg: 3 }}>
              <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
                <ChartUserByCountry />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}
