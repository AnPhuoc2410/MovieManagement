import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import ListMovies from "../components/home/ListMovies";
import Promotions from "../components/home/Event";
import Membership from "../components/home/Membership";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Aurora from "../components/shared/Aurora";
import ScrollToTop from "../components/common/ScrollToTop";

const slides = [
  "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/1215x365.png",
  "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/1215wx365h_4_.jpg",
  "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/a528ec50-cc70-46f0-a2e3-31b279594daa/spider-man-across-the-spider-verse-banner-features-an-epic-number-of-spider-people.jpg?format=1500w",
  "https://th.bing.com/th/id/R.dc64e9a3281832f4d2d87ca943dd4e36?rik=%2fPgUk7wh6wxEQQ&riu=http%3a%2f%2fwww.hidefninja.com%2fwp-content%2fuploads%2f2015%2f01%2finterstellar-banner.jpg&ehk=PYHmoxpd%2f0b3o5xBZIgAI8ojH4Lj7D0Pc37sg8O9mqU%3d&risl=&pid=ImgRaw&r=0",
  "https://www.bhdstar.vn/wp-content/uploads/2025/02/referenceSchemeHeadOfficeallowPlaceHoldertrueheight1069ldapp.jpg",
];

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{ backgroundColor: "#0B0D1A", minHeight: "100vh", color: "white" }}
    >
      {/* Preview Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="movie-preview-modal"
        aria-describedby="movie-banner-preview"
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
          <img
            src={slides[currentBannerIndex]}
            alt="Movie Banner"
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Modal>

      {/* Header */}
      <Header />
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={2.5}
      />
      <Container>
        <Box sx={{ backgroundColor: "#0B0D1A", color: "white", mb: 3 }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            loop={true}
            style={{ width: "100%", height: "auto" }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "initial",
                    borderRadius: "10px",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
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
