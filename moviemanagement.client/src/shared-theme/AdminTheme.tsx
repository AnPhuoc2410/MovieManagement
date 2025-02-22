import { Outlet } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
      <Outlet />
    </ThemeProvider>
  );
}
