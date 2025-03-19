import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios.config";
import ScrollToTop from "../../components/common/ScrollToTop";
import Footer from "../../components/home/Footer";
import Header from "../../components/home/Header";
import Loader from "../../components/shared/Loading";
import Aurora from "../../components/shared/Aurora";
import ScrollFloat from "../../components/shared/ScrollFloat";
import { Promotion } from "../../types/promotion.types";

const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [allPromotions, setAllPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5; // items per page for display

  // For API - similar to UpComingMoviesPage
  const apiPage = 0;
  const apiPageSize = 100; // Fetch all promotions at once for client-side pagination

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);

        // Fetch all promotions at once (or a large batch)
        const response = await api.get(`promotions/page/${apiPage}/pagesize/${apiPageSize}`);

        if (response.data) {
          setAllPromotions(response.data);
        } else {
          setAllPromotions([]);
        }
      } catch (error) {
        console.error("Lỗi Lấy Data promotions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []); // No dependency on currentPage anymore

  // Client-side pagination like UpComingMoviesPage
  const pageCount = Math.ceil(allPromotions.length / pageSize);
  const indexOfLastPromotion = currentPage * pageSize;
  const indexOfFirstPromotion = indexOfLastPromotion - pageSize;
  const currentPromotions = allPromotions.slice(indexOfFirstPromotion, indexOfLastPromotion);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 5, md: 6 } }}>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.08}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: "white",
                mb: 4,
                textTransform: "uppercase",
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              }}
            >
              {t("promotions")}
            </Typography>
          </ScrollFloat>
        </Box>

        {currentPromotions.length === 0 ? (
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
            {currentPromotions.map((promotion, index) => (
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
                  background: "rgba(28, 28, 28, 0.6)",
                  backdropFilter: "blur(10px)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* Image Section */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <CardMedia
                    component="img"
                    image={promotion.image || "/images/default-promotion.jpg"}
                    alt={promotion.promotionName}
                    sx={{
                      height: { xs: "280px", sm: "350px", md: "420px" }, // Match movie poster size
                      width: "100%",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "transform 0.5s ease",
                      objectFit: "contain",
                      "&:hover": { transform: "scale(1.05)" }, // Match movie poster hover
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
                          backgroundColor: "yellow", // Match movie card button
                          color: "black",
                          fontWeight: "bold",
                          px: 4,
                          py: 1,
                          borderRadius: "25px",
                          transition: "transform 0.3s ease, background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#FFD700", // Match movie card button hover
                            transform: "scale(1.05)",
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

        {/* Pagination Controls - Similar to UpComingMoviesPage */}
        {pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pageCount}
              color="primary"
              page={currentPage}
              onChange={handleChangePage}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "white",
                  fontSize: "1.1rem",
                  mx: 0.5,
                },
                "& .Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2) !important",
                },
                "& .MuiPaginationItem-page": {
                  background: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>

      <ScrollToTop />
      <Footer />
    </Box>
  );
};

export default PromotionsPage;
