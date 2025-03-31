import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Button,
} from "@mui/material";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import dayjs from "dayjs";
import api from "../../apis/axios.config";

interface Promotion {
  promotionId: string;
  promotionName: string;
  image?: string;
  fromDate: string;
  toDate: string;
  discount: number;
  content: string;
}

const PromotionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Local state for promotion detail, loading, and error
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      api
        .get(`promotions/${id}`)
        .then((response) => {
          setPromotion(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching promotion:", err);
          setError(t("promotion.detail.not_found"));
          setLoading(false);
        });
    } else {
      setError(t("promotion.detail.not_found"));
      setLoading(false);
    }
  }, [id, t]);

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#0B0D1A",
          color: "white",
          minHeight: "100vh",
          p: 4,
        }}
      >
        <Header />
        <Typography variant="h6" align="center">
          {t("promotion.detail.loading")}
        </Typography>
        <Footer />
      </Box>
    );
  }

  if (error || !promotion) {
    return (
      <Box
        sx={{
          backgroundColor: "#0B0D1A",
          color: "white",
          minHeight: "100vh",
          p: 4,
        }}
      >
        <Header />
        <Typography variant="h6" align="center">
          {error || t("promotion.detail.not_found")}
        </Typography>
        <Button
          onClick={() => navigate("/promotions")}
          variant="contained"
          sx={{ mt: 2 }}
        >
          {t("promotion.detail.back")}
        </Button>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white" }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 10, mb: 7, py: 6 }}>
        <Card
          sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
        >
          {/* Left Side - Image Section */}
          <CardMedia
            component="img"
            image={
              promotion.image ||
              "https://thumbs.dreamstime.com/b/page-not-found-error-hand-drawn-ghost-doodle-vector-illustration-internet-connection-trouble-concept-105206287.jpg"
            }
            alt={promotion.promotionName}
            sx={{
              width: { xs: "100%", md: "50%" },
              height: "auto",
              objectFit: "inherit",
            }}
          />
          {/* Right Side - Text Section */}
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
              {promotion.promotionName}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              {t("promotion.detail.period")}:{" "}
              {dayjs(promotion.fromDate).format("DD/MM/YYYY")} -{" "}
              {dayjs(promotion.toDate).format("DD/MM/YYYY")}
            </Typography>
            <Box
              sx={{ typography: "body1", mt: 1 }}
              className="quill-content"
              dangerouslySetInnerHTML={{ __html: promotion.content }}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, alignSelf: "start" }}
            >
              {t("promotion.detail.book_now")}
            </Button>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default PromotionDetail;
