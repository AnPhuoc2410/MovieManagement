import {
  Box,
  CssBaseline,
  Stack,
  Typography,
  Paper
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import AdminNowShowingMovies from "../../../components/admin/AdminNowShowingMovies";
import { useTranslation } from "react-i18next";


export default function QuanLyBanVe({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) {
  const { t } = useTranslation();
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

              <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
                {t("footer.movies.now_showing")}
              </Typography>

              <AdminNowShowingMovies />

            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
