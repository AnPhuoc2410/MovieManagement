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
        image: "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fkm-m-1.webp&w=1920&q=75",
    },
    {
        image: "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fkm-m-2.webp&w=1920&q=75",
    },
    {
        image: "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fkm-m-3.webp&w=1920&q=75",
    },
    {
        image: "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fmonday_1_.webp&w=1920&q=75"
    }
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
                            <img src={promo.image} alt={`Promo ${index + 1}`} style={{ width: "100%", borderRadius: "10px" }} />
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
            <Button onClick={() => {navigate("/promotions");}} variant="contained" color="warning" sx={{ mt: 2 }}>
                TẤT CẢ ƯU ĐÃI
            </Button>
        </Container>
    );
};

export default Promotions;
