import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import SideMenu from "../components/mui/SideMenu";
import AppNavbar from "../components/mui/AppNavbar";

const adminTheme = createTheme({
  palette: {
    mode: "dark",
    error: {
      main: "#ff6b6b",
    },
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "#ff6b6b", // **bold red color text**
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ff6b6b", // **bold red color text**
          },
        },
      },
    },
  },
});

export default function AdminTheme() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SideMenu />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppNavbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              backgroundColor: "background.default",
              overflowY: "auto",
              px: 3,
              py: 2,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
