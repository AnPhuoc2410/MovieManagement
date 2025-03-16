import { Box, Paper, Tab, Tabs, styled } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Login } from "./Login/Login";
import { Signup } from "./Signup/Signup";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

// Custom styled components
const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: "none",
  "& .MuiTabs-indicator": {
    display: "none", // Hide default indicator
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: "#666",
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  padding: "12px 0",
  width: "50%",
  borderBottom: "3px solid transparent",
  "&.Mui-selected": {
    color: "#000",
    borderBottom: "3px solid yellow",
  },
  "&:hover": {
    color: "#000",
    opacity: 1,
  },
}));

const AuthForm = () => {
  const [tab, setTab] = useState(0);
  const { t } = useTranslation();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                    url('https://cinestar.com.vn/_next/image/?url=%2Fassets%2Fimages%2Fbg-cfriends.webp&w=1920&q=75')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          position: "relative",
          minHeight: "calc(100vh - 200px)",
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: tab === 0 ? "450px" : "600px",
            borderRadius: 2,
            transition: "all 0.3s ease",
            ml: { xs: 0, sm: 4, md: 8 },
            mt: { xs: 0, sm: 4, md: 8 },
            minHeight: "500px",
            overflow: "hidden", // Prevent content overflow
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <StyledTabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                px: 2,
                pt: 1,
              }}
            >
              <StyledTab
                label={t("auth.login.title")}
                sx={{
                  borderTopLeftRadius: 8,
                }}
              />
              <StyledTab
                label={t("auth.signup.title")}
                sx={{
                  borderTopRightRadius: 8,
                }}
              />
            </StyledTabs>
          </Box>

          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              minHeight: { xs: "calc(100vh - 200px)", md: "500px" },
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#FFFFFF",
            }}
          >
            {tab === 0 ? <Login /> : <Signup />}
          </Box>
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
};

export default AuthForm;
