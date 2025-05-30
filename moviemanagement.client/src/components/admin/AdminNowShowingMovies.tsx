import { Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios.config";
import { Movie } from "../../types/movie.types";
import { useTranslation } from "react-i18next";

interface AdminNowShowingMoviesProps {
  onMovieSelect?: (movieId: string) => void;
  selectedMovieId?: string;
}

const AdminNowShowingMovies: React.FC<AdminNowShowingMoviesProps> = ({ onMovieSelect, selectedMovieId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {    const fetchNowShowingMovies = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/movie/showing/page/0/size/100`
        );
        // Ensure we always set an array, handle different response structures
        const moviesData = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching now showing movies:", error);
        toast.error(t("toast.error.movie.loading"));
        setMovies([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchNowShowingMovies();
  }, []);

  const handleSelectMovie = (movie: Movie) => {
    if (onMovieSelect) {
      onMovieSelect(movie.movieId);
    } else {
      navigate(`/admin/ql-ban-ve/ticket/${movie.movieId}`);
    }
  };

  if (loading) {
    return <Typography>Đang tải danh sách phim...</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={3} key={movie.movieId}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              bgcolor: "background.paper",
              boxShadow: 3,
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 6,
              },
            }}
          >
            {/* Image Container */}
            <Box sx={{ position: "relative" }}>
              {/* Movie Poster */}
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  height: { xs: "200px", sm: "250px" },
                  width: "100%",
                }}
              >
                <img
                  src={movie.image}
                  alt={movie.movieName}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </Box>
            </Box>

            {/* Movie Info */}
            <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  height: "3em",
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                }}
              >
                {movie.movieName}
              </Typography>

              <Box sx={{ mt: "auto" }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleSelectMovie(movie)}
                  sx={{
                    bgcolor: selectedMovieId === movie.movieId ? 'primary.dark' : 'primary.main',
                    '&:hover': {
                      bgcolor: selectedMovieId === movie.movieId ? 'primary.dark' : 'primary.dark',
                    },
                  }}
                >
                  {selectedMovieId === movie.movieId ? 'Đã chọn' : 'Chọn phim này'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default AdminNowShowingMovies;
