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
import dayjs from "dayjs";
import api from "../../apis/axios.config";
import Loader from "../../components/shared/Loading";
import Aurora from "../../components/shared/Aurora";

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
          setPromotion(response.data.data);
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom,
          rgba(11, 13, 26, 0.95) 0%,
          rgba(11, 13, 26, 0.85) 100%
        )`,
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 30%, rgba(78, 46, 131, 0.4) 0%, rgba(78, 46, 131, 0) 50%),
                      radial-gradient(circle at 75% 15%, rgba(33, 64, 154, 0.4) 0%, rgba(33, 64, 154, 0) 50%),
                      linear-gradient(135deg, #0B0D1A 0%, #1A1E3C 50%, #3A1155 100%)`,
          zIndex: -1,
        },
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.4,
          pointerEvents: "none",
        }}
      >
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={1.0}
          amplitude={2.5}
          speed={1.0}
        />
      </Box>

      <Header />

      {loading ? (
        <Container maxWidth="md" sx={{ mt: 10, mb: 7, py: 6, textAlign: "center" }}>
          <Loader />
        </Container>
      ) : error || !promotion ? (
        <Container
          maxWidth="xl"
          sx={{
            pt: { xs: "64px", sm: "72px", md: "80px" },
            pb: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {error || t("promotion.detail.not_found")}
          </Typography>
          <Button
            onClick={() => navigate("/promotions")}
            variant="contained"
            sx={{ mt: 2 }}
          >
            {t("promotion.detail.back")}
          </Button>
        </Container>
      ) : (
        <Container
          maxWidth="lg"
          sx={{
            pt: { xs: "64px", sm: "72px", md: "80px" },
            pb: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            zIndex: 1,
          }}
        >
          <Card
            sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, mt: 5 }}
            className="promotion-card"
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
      )}

      <Footer />
    </Box>
  );
};

export default PromotionDetail;
