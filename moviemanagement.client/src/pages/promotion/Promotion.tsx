import React from "react";
import {
  Container,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Button,
} from "@mui/material";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router";

interface Promotion {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const promotions: Promotion[] = [
  {
    id: 1,
    title: "STUDENT - 45K CHO HỌC SINH SINH VIÊN",
    description:
      "Đồng giá 45K/2D cho HSSV/GV/U22 cả tuần tại mọi cụm rạp Cinestar.",
    imageUrl:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fkm-m-1.webp&w=1920&q=75",
  },
  {
    id: 2,
    title: "MONDAY - ƯU ĐÃI NGÀY THỨ HAI",
    description: "Giá vé ưu đãi vào mỗi thứ Hai hàng tuần tại Cinestar.",
    imageUrl:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2FMageINIC%2Fbannerslider%2Fkm-m-2.webp&w=1920&q=75",
  },
];

const Promotion: React.FC = () => {
  const navigate = useNavigate();

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
          ƯU ĐÃI ĐẶC BIỆT
        </Typography>
        <Grid container spacing={4}>
          {promotions.map((promotion, index) => (
            <Grid
              container
              item
              key={promotion.id}
              spacing={2}
              alignItems="center"
              flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
            >
              {/* Image Section */}
              <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                <CardMedia
                  component="img"
                  image={promotion.imageUrl}
                  alt={promotion.title}
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
                      {promotion.title}
                    </Typography>
                    <Typography variant="body2">
                      {promotion.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "yellow", color: "black", mt: 2 }}
                      onClick={() => {
                        navigate(`/promotions/${promotion.id}`);
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

export default Promotion;
