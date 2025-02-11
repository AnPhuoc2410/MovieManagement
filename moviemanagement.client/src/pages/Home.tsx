import { Box, Button, Container, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Header from "../components/Homepage/Header";
import ListMovies from "../components/Homepage/ListMovies";
import Promotions from "../components/Homepage/Promotions";
import Membership from "../components/Homepage/Membership";
import Footer from "../components/Homepage/Footer";

const slides = [
  "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/1215x365.png",
  "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/1215wx365h_4_.jpg",
  "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/a528ec50-cc70-46f0-a2e3-31b279594daa/spider-man-across-the-spider-verse-banner-features-an-epic-number-of-spider-people.jpg?format=1500w",
];

const Homepage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "#0B0D1A", minHeight: "100vh", color: "white" }}>
      {/* Header */}
      <Header />
      {/* Swiper Slider */}
      <Box sx={{ backgroundColor: "#0B0D1A", color: "white", padding: 2 }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          style={{ width: "100%", maxHeight: "400px" }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Box sx={{ textAlign: "center", backgroundColor: "#1A1C2A", padding: 2, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold">ĐẶT VÉ NHANH</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
            <Select variant="outlined" displayEmpty size="small" sx={{ backgroundColor: "white" }}>
              <MenuItem disabled>1. Chọn Rạp</MenuItem>
            </Select>
            <Select variant="outlined" displayEmpty size="small" sx={{ backgroundColor: "white" }}>
              <MenuItem disabled>2. Chọn Phim</MenuItem>
            </Select>
            <Select variant="outlined" displayEmpty size="small" sx={{ backgroundColor: "white" }}>
              <MenuItem disabled>3. Chọn Ngày</MenuItem>
            </Select>
            <Select variant="outlined" displayEmpty size="small" sx={{ backgroundColor: "white" }}>
              <MenuItem disabled>4. Chọn Suất</MenuItem>
            </Select>
            <Button variant="contained" color="secondary">ĐẶT NGAY</Button>
          </Box>
        </Box>
        <ListMovies />
        <Promotions />
      </Container>

      {/* Membership */}
      <Membership />

      {/* Footer */}
      <Footer />

    </Box>
  );
};

export default Homepage;
