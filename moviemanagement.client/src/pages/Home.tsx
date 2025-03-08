import CloseIcon from "@mui/icons-material/Close";
import { Box, Container, IconButton, Modal, SelectChangeEvent } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ScrollToTop from "../components/common/ScrollToTop";
import Promotions from "../components/home/Event";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";
import ListMovies from "../components/home/ListMovies";
import Membership from "../components/home/Membership";
import QuickBookingComponent from "../components/home/QuickBookingComponent";
import Aurora from "../components/shared/Aurora";
import { bannerslider } from "../data/movieBanner.data";
import MovieBannerSlider from "../components/home/MovieBannerSlider";

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(true);
  const [age, setAge] = useState("");
  const [randomBanner, setRandomBanner] = useState("");

  // Pick a random banner only once when the component mounts
  useEffect(() => {
    setRandomBanner(bannerslider[Math.floor(Math.random() * bannerslider.length)]);
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box
      sx={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(78, 46, 131, 0.4) 0%, rgba(78, 46, 131, 0) 50%),
          radial-gradient(circle at 75% 15%, rgba(33, 64, 154, 0.4) 0%, rgba(33, 64, 154, 0) 50%),
          linear-gradient(135deg, #0B0D1A 0%, #1A1E3C 50%, #3A1155 100%)
        `,
        minHeight: "100vh",
        color: "white",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* Pop-up Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="movie-preview-modal"
        aria-describedby="movie-banner-preview"
        sx={{
          "& .MuiBox-root": {
            width: { xs: "95%", sm: "80%" },
            maxWidth: "1000px",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "1000px",
            bgcolor: "rgba(0, 0, 0, 0.9)",
            boxShadow: 24,
            outline: "none",
            borderRadius: 2,
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              "&:hover": {
                bgcolor: "rgba(131, 75, 255, 0.7)",
              },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          {randomBanner && (
            <img
              src={randomBanner}
              alt="Movie Banner"
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          )}
        </Box>
      </Modal>

      {/* Aurora effect */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} blend={1.0} amplitude={2.5} speed={1.0} />
      </Box>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container
        sx={{
          paddingTop: { xs: "80px", sm: "90px", md: "100px" },
          position: "relative",
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box sx={{ color: "white", mb: 3, mt: 2 }}>
          <MovieBannerSlider />
        </Box>
        <QuickBookingComponent t={t} />
        <ListMovies />
        <Promotions />
      </Container>

      {/* Membership */}
      <Membership />

      {/* Footer */}
      <ScrollToTop />
      <Footer />
    </Box>
  );
};

export default Homepage;
