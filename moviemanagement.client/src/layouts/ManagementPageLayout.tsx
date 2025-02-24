import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppTheme from "../shared-theme/AppTheme";
import SideMenu from "../components/mui/SideMenu";
import AppNavbar from "../components/mui/AppNavbar";
import Header from "../components/mui/Header";

interface ManagementPageLayoutProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}

const ManagementPageLayout: React.FC<ManagementPageLayoutProps> = ({
  children,
  disableCustomTheme = false,
}) => {
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

              {children}
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ManagementPageLayout;
