import { Box } from "@mui/material";
import React from "react";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  hideHeader = false,
  hideFooter = false,
}) => {
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
      {!hideHeader && <Header />}

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
        {children}
      </Box>

      {!hideFooter && <Footer />}
    </Box>
  );
};

export default MainLayout;
