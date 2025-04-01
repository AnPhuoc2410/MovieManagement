import CloseIcon from "@mui/icons-material/Close";
import { Box, Container, IconButton, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ScrollToTop from "../../components/common/ScrollToTop";
import Promotions from "../../components/home/Event";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import ListMovies from "../../components/home/ListMovies";
import Membership from "../../components/home/Membership";
import MovieBannerSlider from "../../components/home/MovieBannerSlider";
import QuickBookingComponent from "../../components/home/QuickBookingComponent";
import Aurora from "../../components/shared/Aurora";
import { bannerslider } from "../../data/movieBanner.data";
import { styles } from "./style";
import ChatBot from "react-chatbotify";
import MyChatBot from "../../components/chatbot";

const Homepage: React.FC = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(true);
  const [randomBanner, setRandomBanner] = useState("");

  // Pick a random banner only once when the component mounts
  useEffect(() => {
    setRandomBanner(
      bannerslider[Math.floor(Math.random() * bannerslider.length)],
    );
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Box sx={styles.pageWrapper}>
      {/* Pop-up Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="movie-preview-modal"
        aria-describedby="movie-banner-preview"
        sx={styles.modal}
      >
        <Box sx={styles.modalBox}>
          <IconButton onClick={handleCloseModal} sx={styles.closeButton}>
            <CloseIcon />
          </IconButton>
          {randomBanner && (
            <img
              src={randomBanner}
              alt="Movie Banner"
              loading="lazy"
              style={styles.bannerImage as React.CSSProperties}
            />
          )}
        </Box>
      </Modal>

      {/* Aurora effect */}
      <Box sx={styles.auroraWrapper}>
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={1.0}
          amplitude={2.5}
          speed={1.0}
        />
      </Box>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container sx={styles.mainContent}>
        <Box sx={styles.bannerContainer}>
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
      <MyChatBot />
      <Footer />
    </Box>
  );
};

export default Homepage;
