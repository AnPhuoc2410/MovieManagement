import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TranslateIcon from "@mui/icons-material/Translate";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../apis/axios.config";
import toast from "react-hot-toast";
import Loader from "../shared/Loading";
import { Movie } from "../../types/movie.types";
import { useTranslation } from "react-i18next";

const MovieDetail: React.FC = () => {
  const location = useLocation();
  const { movieId } = location.state;
  const [movie, setMovie] = useState<Movie>();
  const [openTrailer, setOpenTrailer] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const [trailerUrl, setTrailerUrl] = useState<string>();

  const fetchMovieById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`Movie/${movieId}`);
      setMovie(response.data);
      console.log("Movie detail:", response.data);
    } catch (error: any) {
      console.error("Failed to fetch movie:", error);
      toast.error(error.message);
    } finally {
      console.log(movieId + "haha");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieById();
  }, []);

  const handleOpenTrailer = (url: string) => {
    let embedUrl = url.replace("youtu.be", "youtube.com/embed");
    embedUrl = embedUrl.replace("watch?v=", "embed/");
    embedUrl = embedUrl + "?autoplay=1";
    setTrailerUrl(embedUrl);
    setOpenTrailer(true);
  };
  const handleCloseTrailer = () => setOpenTrailer(false);

  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  if (loading) return <Loader />;
  return (
    <Box sx={{ backgroundColor: "#0B0D1A", minHeight: "50vh", color: "white" }}>
      <Container maxWidth="lg" sx={{ mt: 13, color: "white" }}>
        {!movieId || !movie ? (
          <>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}
            >
              {t("oops")}
            </Typography>
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
              Phim không tồn tại.
            </Typography>
          </>
        ) : (
          <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
            {/* Movie Poster */}
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={movie?.image}
                alt={movie?.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                  objectFit: "cover",
                }}
              />
            </Grid>

            {/* Movie Info */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                mb={2}
                fontFamily={"JetBrains Mono"}
              >
                {movie?.name}
              </Typography>

              <Box sx={{ mb: 3, fontWeight: "bold" }}>
                <Chip
                  label={movie?.rating}
                  color="error"
                  sx={{ mb: 1, mr: 1 }}
                />

                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${movie?.duration}'`}
                  sx={{ mr: 1, mb: 1, color: "white" }}
                />
                {/* <Chip
                icon={<LocationOnIcon />}
                label={movie.country}
                sx={{ mr: 1, mb: 1, color: "white" }}
              />
              <Chip
                icon={<TranslateIcon />}
                label={movie.language}
                sx={{ mr: 1, mb: 1, color: "white" }}
              /> */}
                <Chip
                  label={movie?.categories
                    .map((category) => category.name)
                    .join(", ")}
                  sx={{
                    mr: 1,
                    mb: 1,
                    backgroundColor: "#e67e22",
                    color: "white",
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                fontFamily={"JetBrains Mono"}
              >
                MÔ TẢ
              </Typography>

              <Box sx={{ mb: 3, textAlign: "justify", flexGrow: 1 }}>
                <Typography
                  mb={1}
                  variant="body1"
                  fontFamily={"JetBrains Mono"}
                >
                  <strong>Đạo diễn:</strong> {movie?.director}
                </Typography>
                <Typography
                  mb={1}
                  variant="body1"
                  sx={{ textAlign: "left" }}
                  fontFamily={"JetBrains Mono"}
                >
                  <strong>Diễn viên:</strong> {movie?.actors}
                </Typography>
                <Typography
                  mb={1}
                  variant="body1"
                  fontFamily={"JetBrains Mono"}
                >
                  <strong>Khởi chiếu:</strong> {formatDate(movie?.fromDate)}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  mt={4}
                  fontFamily={"JetBrains Mono"}
                >
                  NỘI DUNG PHIM
                </Typography>
                <Typography
                  paragraph
                  variant="body1"
                  sx={{ textAlign: "justify" }}
                  fontFamily={"JetBrains Mono"}
                >
                  {movie?.content}
                </Typography>
              </Box>
              <Box sx={{ mt: "auto" }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleOpenTrailer(movie?.trailer)}
                  sx={{
                    color: "white",
                    borderColor: "#e67e22",
                    mr: 2,
                    position: "relative",
                    overflow: "hidden",
                    transition: "color 0.5s ease-in-out",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to right, #e67e22,rgb(77, 91, 185))",
                      transform: "translateX(-100%)",
                      transition: "transform 0.5s ease-in-out",
                      zIndex: 0,
                    },
                    "&:hover": {
                      color: "black",
                    },
                    "&:hover::before": {
                      transform: "translateX(0)",
                    },
                    "& span": {
                      position: "relative",
                      zIndex: 1,
                    },
                  }}
                >
                  <span>XEM TRAILER</span>
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#e67e22",
                    position: "relative",
                    overflow: "hidden",
                    transition: "color 0.5s ease-in-out",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to right, #e67e22,rgb(77, 91, 185))",
                      transform: "translateX(-100%)",
                      transition: "transform 0.5s ease-in-out",
                      zIndex: 0,
                    },
                    "&:hover": {
                      color: "white",
                    },
                    "&:hover::before": {
                      transform: "translateX(0)",
                    },
                    "& span": {
                      position: "relative",
                      zIndex: 1,
                    },
                  }}
                >
                  <span>ĐẶT VÉ NGAY</span>
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Thêm Modal cho trailer */}
      <Modal
        open={openTrailer}
        onClose={handleCloseTrailer}
        aria-labelledby="trailer-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(61, 14, 97, 0.95)",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "80%",
            maxWidth: "1000px",
            aspectRatio: "16/9",
            bgcolor: "transparent",
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src={trailerUrl}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default MovieDetail;
