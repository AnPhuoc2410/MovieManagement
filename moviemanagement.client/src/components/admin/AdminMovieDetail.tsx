import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../apis/axios.config";
import { Movie } from "../../types/movie.types";
import Loader from "../shared/Loading";

interface MovieDetailProps {
  onMovieLoad?: (movie: Movie) => void;
}

const AdminMovieDetail: React.FC<MovieDetailProps> = ({ onMovieLoad }) => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMovieById = async () => {
    try {
      setLoading(true);
      const response = await api.get(`Movie/${movieId}`);
      setMovie(response.data.data);
      // Pass the movie data to the parent component when it's loaded
      if (onMovieLoad) {
        onMovieLoad(response.data.data);
      }
      console.log("Movie detail:", response.data.data);
    } catch (error: any) {
      console.error("Failed to fetch movie:", error);
    } finally {
      console.log(movieId + "haha");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieById();
  }, []);

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
    <Box sx={{ bgcolor: "background.paper", color: "text.primary" }}>
      <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
        {/* Movie Poster */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 1, height: '100%' }}>
            <Box
              component="img"
              src={movie?.image}
              alt={movie?.movieName}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 1,
                objectFit: "contain",
              }}
            />
          </Paper>
        </Grid>

        {/* Movie Info */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
          >
            {movie?.movieName}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Chip label={movie?.rating} color="error" sx={{ mb: 1, mr: 1 }} />
            <Chip
              icon={<AccessTimeIcon />}
              label={`${movie?.duration}'`}
              sx={{ mr: 1, mb: 1 }}
              color="default"
            />
            <Chip
              label={movie?.categories
                .map((category) => category.name)
                .join(", ")}
              sx={{
                mr: 1,
                mb: 1,
                backgroundColor: "red",
                color: "white",
              }}
            />
          </Box>

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            mb={1}
          >
            MÔ TẢ
          </Typography>

          <Box sx={{ mb: 3, textAlign: "justify", flexGrow: 1 }}>
            <Typography mb={1} variant="body2">
              <strong>Đạo diễn:</strong> {movie?.director}
            </Typography>
            <Typography
              mb={1}
              variant="body2"
              sx={{ textAlign: "left" }}
            >
              <strong>Diễn viên:</strong> {movie?.actors}
            </Typography>
            <Typography mb={1} variant="body2">
              <strong>Khởi chiếu:</strong> {formatDate(movie?.fromDate)}
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              mb={1}
              mt={2}
            >
              NỘI DUNG PHIM
            </Typography>
            <Typography
              paragraph
              variant="body2"
              sx={{ textAlign: "justify" }}
            >
              {movie?.content}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminMovieDetail;
