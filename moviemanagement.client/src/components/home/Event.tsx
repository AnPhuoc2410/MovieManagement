import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router";

const promotions = [
  {
    image:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fkm-m-1.webp&w=1920&q=75",
  },
  {
    image:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fkm-m-2.webp&w=1920&q=75",
  },
  {
    image:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fkm-m-3.webp&w=1920&q=75",
  },
  {
    image:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fmonday_1_.webp&w=1920&q=75",
  },
];

const Promotions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4, textAlign: "center", padding: 5 }}>
      <Typography variant="h4" fontWeight="bold" color="white" sx={{ mb: 2 }}>
        KHUYẾN MÃI
      </Typography>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        style={{ width: "100%", paddingBottom: "20px" }}
      >
        {promotions.map((promo, index) => (
          <SwiperSlide key={index}>
            <Box sx={{ textAlign: "center" }}>
              <img
                src={promo.image}
                alt={`Promo ${index + 1}`}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      <Button
        onClick={() => {
          navigate("/promotions");
        }}
        variant="contained"
        sx={{
          mt: 2,
          position: "relative",
          overflow: "hidden",
          bgcolor: "transparent",
          border: "2px solid yellow",
          color: "yellow",
          transition: "color 0.5s ease-in-out",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #e67e22,rgb(77, 91, 185))",
            transform: "translateX(-100%)",
            transition: "transform 0.5s ease-in-out",
            zIndex: 0,
          },
          "&:hover": {
            color: "white",
          },
          "&:hover::before": {
            transform: "translateX(0)",
          },
          "& span": {
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <span>TẤT CẢ ƯU ĐÃI</span>
      </Button>
    </Container>
  );
};

export default Promotions;
