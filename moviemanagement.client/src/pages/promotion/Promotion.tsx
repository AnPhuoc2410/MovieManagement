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

interface Promotion {
  promotionId: string;
  promotionName: string;
  image: string;
  fromDate: string;
  toDate: string;
  discount: number;
  content: string;
}

const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    fetch("https://localhost:7119/api/Promotions/GetAllPromotions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch promotions");
        }
        return response.json();
      })
      .then((data) => {
        setPromotions(data);
      })
      .catch((error) => console.error("Error fetching promotions:", error));
  }, []);

  return (
    <Box sx={{ backgroundColor: "#0B0D1A", minHeight: "100vh", color: "white" }}>
      <Header />
      <Container>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
        >
          ƯU ĐÃI ĐẶC BIỆT
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
              <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                <CardMedia
                  component="img"
                  image={promotion.image}
                  alt={promotion.promotionName}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
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
                      {promotion.content}
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
