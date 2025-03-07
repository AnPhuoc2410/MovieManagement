import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ScrollFloat from "../shared/ScrollFloat";

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
  const { t } = useTranslation();

  return (
    <Container
      sx={{
        mt: 4,
        textAlign: "left",
        padding: 5,
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="white" sx={{ mb: 2 }}>
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.07}
        >
          {t("promotions")}
        </ScrollFloat>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
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
            backgroundColor: "yellow",
            color: "black",
            fontWeight: "bold",
            width: "250px",
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
          <span>{t("list_promotions")}</span>
        </Button>
      </Box>
    </Container>
  );
};

export default Promotions;
