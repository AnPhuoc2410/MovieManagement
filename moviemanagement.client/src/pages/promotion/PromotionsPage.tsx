import React, { useState, useEffect } from "react";
import {
  Container,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Button,
  Grid,
} from "@mui/material";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import CloudinaryImage from "../../components/cloudinary/CloudinaryImage";
import { useTranslation } from "react-i18next";

interface Promotion {
  promotionId: string;
  promotionName: string;
  image?: string;
  fromDate: string;
  toDate: string;
  discount: number;
  content: string;
}

const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7119/api/Promotions/GetAllPromotions",
        );
        setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <Box
      sx={{ backgroundColor: "#0B0D1A", minHeight: "100vh", color: "white" }}
    >
      <Header />
      <Container>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
        >
          {t("promotions")}
        </Typography>
        <Grid container spacing={4}>
          {promotions.map((promotion, index) => (
            <Grid
              container
              item
              key={promotion.promotionId}
              spacing={2}
              alignItems="center"
              flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
            >
              {/* Image Section */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Box
                  sx={{
                    height: 300,
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: 2,
                  }}
                >
                  {promotion.image ? (
                    <CloudinaryImage imageUrl={promotion.image} hd />
                  ) : (
                    <Typography variant="subtitle1">No image</Typography>
                  )}
                </Box>
              </Grid>

              {/* Text Section */}
              <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                <Box
                  sx={{
                    background: "transparent",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    padding: 3,
                    width: "100%",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {promotion.promotionName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {dayjs(promotion.fromDate).format("DD/MM/YYYY")} -{" "}
                      {dayjs(promotion.toDate).format("DD/MM/YYYY")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, fontWeight: "bold", color: "yellow" }}
                    >
                      {promotion.discount}% Giảm Giá
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "yellow", color: "black", mt: 2 }}
                      onClick={() => {
                        navigate(`/promotions/${promotion.promotionId}`);
                      }}
                    >
                      Đặt Vé Ngay
                    </Button>
                  </CardContent>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default PromotionsPage;
