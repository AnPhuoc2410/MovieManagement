import React, { useState, useEffect } from "react";
import {
  Container,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  CardMedia,
} from "@mui/material";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import CloudinaryImage from "../../components/cloudinary/CloudinaryImage";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import Loader from "../../components/shared/Loading";
import Aurora from "../../components/shared/Aurora";
import ScrollToTop from "../../components/common/ScrollToTop";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `Promotions/page/${page}/pageSize/${pageSize}`,
        );
        if (response.data.length === 0 && page > 0) {
          toast.error("Không còn trang tiếp theo");
          setPage(page - 1);
        } else {
          setPromotions(response.data);
        }
      } catch (error) {
        console.error("Lỗi Lấy Data promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [page]);

  if (loading) return <Loader />;

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
      {/* Aurora Effect */}
      {/* <Box
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
      </Box> */}

      <Header />

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
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mt: 6,
            mb: 6,
            fontWeight: "bold",
            color: "white",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -16,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "3px",
              background: "linear-gradient(90deg, #834bff 0%, #FF3232 100%)",
              borderRadius: "2px",
            },
          }}
        >
          {t("promotions")}
        </Typography>

        {promotions.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              m: 4,
              p: 4,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#834bff" }}>
              Hiện không có khuyến mãi nào.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {promotions.map((promotion, index) => (
              <Grid
                container
                item
                key={promotion.promotionId}
                spacing={3}
                alignItems="center"
                flexDirection={index % 2 === 0 ? "row" : "row-reverse"}
                sx={{
                  mb: 4,
                  p: 2,
                  borderRadius: 2,
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {/* Image Section */}
                <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
                  <CardMedia
                    component="img"
                    image={promotion.image || "/images/default-promotion.jpg"} // Fallback image
                    alt={promotion.promotionName}
                    sx={{
                      height: 300,
                      width: "100%",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "transform 0.3s ease",
                      objectFit: "contain",
                      "&:hover": { transform: "scale(1.02)" },
                    }}
                  />
                </Grid>

                {/* Text Section */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      p: 3,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          mb: 2,
                          background:
                            "linear-gradient(90deg, #834bff 0%, #FF3232 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {promotion.promotionName}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {dayjs(promotion.fromDate).format("DD/MM/YYYY")} -{" "}
                        {dayjs(promotion.toDate).format("DD/MM/YYYY")}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 3,
                          color: "#FFD700",
                          fontWeight: "bold",
                        }}
                      >
                        {promotion.discount}% Giảm Giá
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() =>
                          navigate(`/promotions/${promotion.promotionId}`)
                        }
                        sx={{
                          background:
                            "linear-gradient(90deg, #834bff 0%, #FF3232 100%)",
                          color: "white",
                          px: 4,
                          py: 1,
                          borderRadius: "25px",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #834bff 0%, #FF3232 100%)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 5px 15px rgba(131, 75, 255, 0.4)",
                          },
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
        )}

        {/* Pagination Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              color: "white",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.2)",
              },
              "&.Mui-disabled": {
                background: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            Trang Trước
          </Button>
          <Button
            variant="contained"
            onClick={() => setPage((prev) => prev + 1)}
            sx={{
              background: "linear-gradient(90deg, #834bff 0%, #FF3232 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(90deg, #9b69ff 0%, #ff4747 100%)",
              },
            }}
          >
            Trang Tiếp Theo
          </Button>
        </Box>
      </Container>

      <ScrollToTop />
      <Footer />
    </Box>
  );
};

export default PromotionsPage;
