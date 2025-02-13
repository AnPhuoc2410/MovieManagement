import React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Button,
  Grid,
} from "@mui/material";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import { useParams } from "react-router";

const PromotionDetail: React.FC = () => {
  const id = useParams();
  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white" }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 10, mb: 7, py: 6 }}>
        <Card
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          {/* Left Side - Image */}
          <CardMedia
            component="img"
            image="https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/2024/092024/T4VV_350x495.jpg"
            alt="Promotion Banner"
            sx={{
              width: { xs: "100%", md: "40%" },
              height: "auto",
              objectFit: "cover",
            }}
          />

          {/* Right Side - Text Content */}
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 3,
            }}
          >
            <Typography variant="h5" color="primary" gutterBottom>
              HAPPY WEDNESDAY - THỨ TƯ VUI VẺ - GIÁ VÉ HẠT DẺ
            </Typography>
            <Typography variant="body1" paragraph>
              Chân thành cảm ơn quý khách hàng đã tin tưởng và đồng hành cùng
              CGV. CGV áp dụng chính sách giá vé đặc biệt nhằm tri ân khách
              hàng:
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                🎟 Giá vé ưu đãi:
              </Typography>
              <Typography variant="body1">
                🎬 55.000đ - Một số khu vực
              </Typography>
              <Typography variant="body1">
                🎬 60.000đ - Một số khu vực khác
              </Typography>
              <Typography variant="body1">
                🎬 70.000đ - Các thành phố lớn
              </Typography>
              <Typography variant="body1">
                🎬 75.000đ - TP. Hồ Chí Minh, Hà Nội, Hải Phòng...
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, alignSelf: "start" }}
            >
              Đặt Vé Ngay
            </Button>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default PromotionDetail;
