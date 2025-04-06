import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Button, Chip, Container, Grid, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import api from "../../apis/axios.config";
import { Movie } from "../../types/movie.types";
import Loader from "../shared/Loading";
import { PlayCircleOutline } from "@mui/icons-material";

interface MovieDetailProps {
  onMovieLoad?: (movie: Movie) => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ onMovieLoad }) => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie>();
  const [openTrailer, setOpenTrailer] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const [trailerUrl, setTrailerUrl] = useState<string>();

  const fetchMovieById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`Movie/${movieId}`);
      setMovie(response.data.data);
      // Pass the movie data to the parent component when it's loaded
      if (onMovieLoad) {
        onMovieLoad(response.data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch movie:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieById();
  }, [t]);

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
    <Box
      sx={{
        minHeight: "50vh",
        color: "white",
        mb: 5,
      }}
    >
      <Container maxWidth="lg" sx={{ color: "white" }}>
        <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
          {/* Movie Poster */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={movie?.image}
              alt={movie?.movieName}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 0.5,
                border: "1px solid",
                borderColor: "#f1f1f1",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                objectFit: "cover",
              }}
            />
          </Grid>

          {/* Movie Info */}
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" fontWeight="bold" mb={2} fontFamily={"JetBrains Mono"}>
              {movie?.movieName}
            </Typography>

            <Box sx={{ mb: 3, fontWeight: "bold" }}>
              <Chip label={movie?.rating} color="error" sx={{ mb: 1, mr: 1 }} />

              <Chip icon={<AccessTimeIcon />} label={`${movie?.duration}'`} sx={{ mr: 1, mb: 1, color: "black", backgroundColor: "yellow" }} />
              <Chip
                label={movie?.categories.map((category) => category.name).join(", ")}
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: "#e67e22",
                  color: "white",
                }}
              />
            </Box>

            <Typography variant="h6" fontWeight="bold" mb={2} fontFamily={"JetBrains Mono"}>
              {t("movie_detail.description")}
            </Typography>

            <Box sx={{ mb: 3, textAlign: "justify", flexGrow: 1 }}>
              <Typography mb={1} variant="body1" fontFamily={"JetBrains Mono"}>
                <strong>{t("movie_detail.director")}</strong> {movie?.director}
              </Typography>
              <Typography mb={1} variant="body1" sx={{ textAlign: "left" }} fontFamily={"JetBrains Mono"}>
                <strong>{t("movie_detail.actors")}</strong> {movie?.actors}
              </Typography>
              <Typography mb={1} variant="body1" fontFamily={"JetBrains Mono"}>
                <strong>{t("movie_detail.release_date")}</strong> {formatDate(movie?.fromDate)}
              </Typography>
              <Typography variant="h6" fontWeight="bold" mb={2} mt={4} fontFamily={"JetBrains Mono"}>
                {t("movie_detail.content")}
              </Typography>
              <Typography paragraph variant="body1" sx={{ textAlign: "justify" }} fontFamily={"JetBrains Mono"}>
                {movie?.content}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                <PlayCircleOutline sx={{ color: "white", mr: 1 }} />
                <Button
                  variant="text"
                  size="large"
                  onClick={() => movie?.trailer && handleOpenTrailer(movie.trailer)}
                  sx={{
                    color: "white",
                    textTransform: "none",
                    fontSize: "1.5rem",
                    textDecoration: "underline",
                    "&:hover": {
                      textDecoration: "underline",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {t("view_trailer")}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
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
