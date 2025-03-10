import React, { useState, useEffect } from "react";
import {
  Container,
  CardContent,
  Typography,
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
import toast from "react-hot-toast";
import api from "../../apis/axios.config";
import Loader from "../../components/shared/Loading";

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
  const [page, setPage] = useState<number>(0);
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
      sx={{ backgroundColor: "#0B0D1A", minHeight: "100vh", color: "white" }}
    >
      <Header />
      <Container sx={{ mt: 10, p: 4 }}>
        <Typography
          variant="h4"
          sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
        >
          {t("promotions")}
        </Typography>

        {promotions.length === 0 ? (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              m: 4,
              p: 4,
              border: 2,
              color: "Highlight",
            }}
          >
            Hiện không có khuyến mãi nào.
          </Typography>
        ) : (
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
                        onClick={() =>
                          navigate(`/promotions/${promotion.promotionId}`)
                        }
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

        {/* Pagination Controls Always Rendered */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              position: "relative",
              overflow: "hidden",
              bgcolor: "yellow",
              color: "black",
              mx: 2,
            }}
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          >
            Trang Trước
          </Button>
          <Button
            variant="contained"
            sx={{ mx: 2 }}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Trang Tiếp Theo
          </Button>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default PromotionsPage;
