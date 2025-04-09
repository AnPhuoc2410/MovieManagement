import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedDataGrid from "./CustomizedDataGrid";
import MonthlyRevenueBarChart from "./MonthlyRevenueBarChart";
import DailyRevenueLineChart from "./DailyRevenueLineChart";
import StatCard, { StatCardProps } from "./StatCard";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import api from "../../apis/axios.config";
import Loader from "../shared/Loading";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

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
  const [revenueData, setRevenueData] = useState<Record<string, number>>({});
  const [years, setYears] = useState<number[]>([]);
  const [months, setMonths] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [topCategories, setTopCategories] = useState<{ categoryName: string; ticketsSold: number }[]>([]);
  const [topShowtimes, setTopShowtimes] = useState<{ [key: string]: number }>({});
  const [topMovies, setTopMovies] = useState<{ movieName: string; revenue: number }[]>([]);
  const [topMembers, setTopMembers] = useState<{ memberName: string; purchasedTicket: number; currentPoint: number; totalPoint: number }[]>([]);
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

  const fetchRevenueData = async () => {
    try {
      const response = await api.get("dashboard/revenue");
      const data = response.data.data || {};
      setRevenueData(data);

      // Set available years from the revenue data
      const yearsFromData = Array.from(new Set(Object.keys(data).map((date) => new Date(date).getFullYear()))).sort();

      setYears(yearsFromData);
      if (yearsFromData.length > 0) {
        setSelectedYear(Math.max(...yearsFromData));
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setYears([]);
      setMonths([]);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const monthsInYear = Array.from(
        new Set(
          Object.keys(revenueData)
            .filter((date) => new Date(date).getFullYear() === selectedYear)
            .map((date) => new Date(date).getMonth() + 1),
        ),
      );
      setMonths(monthsInYear);

      if (!monthsInYear.includes(selectedMonth || 0)) {
        setSelectedMonth(Math.max(...monthsInYear));
      }
    }
  }, [selectedYear]);

  const monthlyRevenue = months.map((month) => {
    const monthRevenue = Object.keys(revenueData)
      .filter((date) => new Date(date).getFullYear() === selectedYear && new Date(date).getMonth() + 1 === month)
      .reduce((sum, date) => sum + revenueData[date], 0);
    return { month, revenue: monthRevenue };
  });

  const dailyRevenue = Object.keys(revenueData)
    .filter((date) => new Date(date).getFullYear() === selectedYear && new Date(date).getMonth() + 1 === selectedMonth)
    .map((date) => ({ date, revenue: revenueData[date] }));

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
  };

  const fetchTicketSoldLast30Days = async () => {
    try {
      const response = await api.get("dashboard/ticket-sold-daily-last-30-days");
      console.log("Ticket sold last 30 days: ", response.data.data);
      setTotalTicketSoldLast30Days(response.data.data);
    } catch (error) {
      console.error("Error fetching total members:", error);
    }
  };

  const fetchTopCategories = async () => {
    try {
      const response = await api.get("dashboard/category");
      console.log("Top Categories: ", response.data.data);
      setTopCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching top categories:", error);
    }
  };

  const fetchTopShowtimes = async () => {
    try {
      const response = await api.get("dashboard/showtime");
      console.log("Top Showtimes: ", response.data.data);
      if (response.data.data && response.data.data.length > 0) {
        setTopShowtimes(response.data.data[0].topRevenue || {});
      }
    } catch (error) {
      console.error("Error fetching top showtimes:", error);
    }
  };

  const fetchTopMovies = async () => {
    try {
      const response = await api.get("dashboard/movie");
      console.log("Top Movies: ", response.data.data);
      setTopMovies(response.data.data.slice(0, 10)); // Get top 10 movies
    } catch (error) {
      console.error("Error fetching top movies:", error);
    }
  };

  const fetchTopMembers = async () => {
    try {
      const response = await api.get("dashboard/member");
      console.log("Top Members: ", response.data.data);
      setTopMembers(response.data.data.slice(0, 50)); // Get top 50 members
    } catch (error) {
      console.error("Error fetching top members:", error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("excel/export", {
        responseType: "blob", // Ensure the response is treated as a binary file
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Generate the filename with the current date
      const date = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
      const fileName = `Thong ke - ${date}.xlsx`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  useEffect(() => {
    fetchTotalMember();
    fetchMemberDailyLast30Days();
    fetchMovies();
    fetchMovieDailyLast30Days();
    fetchTotalTicketSold();
    fetchTicketSoldLast30Days();
    fetchTopCategories();
    fetchTopShowtimes();
    fetchTopMovies();
    fetchTopMembers();
  }, []);
  return (
    <>
      {!totalMembers || movies.length == 0 || !totalTicketSold || totalMembersLast30Days.length == 0 || moviesLast30Days.length == 0 || totalMembersLast30Days.length == 0 ? (
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
          </Grid>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{ mb: 2 }}>
            <Typography component="h2" variant="h6" sx={{ mr: 2 }}>
              {t("dashboard.title_revenue")}
            </Typography>
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>{t("dashboard.select_year")}</InputLabel>
                <Select value={selectedYear || ""} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>{t("dashboard.select_month")}</InputLabel>
                <Select value={selectedMonth || ""} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" onClick={handleExport} startIcon={<FileDownloadOutlinedIcon />}>
                {t("dashboard.export")}
              </Button>
            </Stack>
          </Stack>
          <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DailyRevenueLineChart data={dailyRevenue} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MonthlyRevenueBarChart data={monthlyRevenue} />
            </Grid>
          </Grid>

          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            {t("dashboard.title_leaderboard")}
          </Typography>
          <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
            <Grid size={{ xs: 12, md: 6 }}>
              {topMovies.length > 0 ? (
                <Box sx={{ height: 300, p: 2, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                  <Typography component="h2" variant="subtitle2" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                    {t("dashboard.top_movies")}
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: topMovies.map((movie) => movie.movieName),
                      },
                    ]}
                    series={[
                      {
                        data: topMovies.map((movie) => movie.revenue),
                        label: t("dashboard.movie_unit") + " (VND)",
                        color: "#2196f3",
                      },
                    ]}
                    height={250}
                    layout="vertical"
                  />
                </Box>
              ) : (
                <Box sx={{ height: 250, p: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    No movie revenue data available
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {Object.keys(topShowtimes).length > 0 ? (
                <Box sx={{ height: 300, p: 2, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                  <Typography component="h2" variant="subtitle2" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                    {t("dashboard.top_showtime")}
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: Object.keys(topShowtimes),
                      },
                    ]}
                    series={[
                      {
                        data: Object.values(topShowtimes),
                        label: t("dashboard.showtime_unit"),
                      },
                    ]}
                    height={250}
                  />
                </Box>
              ) : (
                <Box sx={{ height: 300, p: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    No showtime revenue data available
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
            <Grid size={{ xs: 12, lg: 7 }}>
              {topMembers.length > 0 ? (
                <Box sx={{ height: 570, p: 2, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                    <Typography component="h2" variant="subtitle2" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                    {t("dashboard.top_members")}
                    </Typography>
                  <DataGrid
                    columns={[
                      { field: "memberName", headerName: t("dashboard.member_name"), flex: 1 },
                      {
                        field: "purchasedTicket",
                        headerName: t("dashboard.tickets_purchased"),
                        width: 150,
                        type: "number",
                        headerAlign: "center",
                        align: "center",
                      },
                      {
                        field: "currentPoint",
                        headerName: t("dashboard.current_points"),
                        width: 150,
                        type: "number",
                        headerAlign: "center",
                        align: "center",
                      },
                      {
                        field: "totalPoint",
                        headerName: t("dashboard.total_points"),
                        width: 150,
                        type: "number",
                        headerAlign: "center",
                        align: "center",
                      },
                    ]}
                    rows={topMembers.map((member, index) => ({
                      id: index,
                      memberName: member.memberName,
                      purchasedTicket: member.purchasedTicket,
                      currentPoint: member.currentPoint,
                      totalPoint: member.totalPoint,
                    }))}
                    slots={{ toolbar: GridToolbar }}
                    sx={{ height: 500 }}
                  />
                </Box>
              ) : (
                <Box sx={{ height: 400, p: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    No member data available
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              {topCategories.length > 0 ? (
                <Box sx={{ height: 300, p: 2, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                  <Typography component="h2" variant="subtitle2" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
                    {t("dashboard.top_categories")}
                  </Typography>
                  <PieChart
                    series={[
                      {
                        data: topCategories.slice(0, 5).map((category) => ({
                          id: category.categoryName,
                          value: category.ticketsSold,
                          label: category.categoryName,
                        })),
                        highlightScope: { faded: "global", highlighted: "item" },
                        faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                      },
                    ]}
                    height={200}
                  />
                </Box>
              ) : (
                <Box sx={{ height: 300, p: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    No category data available
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
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
          </Grid> */}
        </Box>
      )}
    </>
  );
}
