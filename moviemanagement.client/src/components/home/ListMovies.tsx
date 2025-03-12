import { Box, Button, Container, Typography, Chip, Modal } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../index.scss";
import ScrollFloat from "../shared/ScrollFloat";
import "./ListMovies.css";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import api from "../../apis/axios.config";
import Loader from "../shared/Loading";

const MovieSlider = ({
  movies,
  title,
  navigateTo,
  onOpenTrailer,
}: {
  movies: any[];
  title: ReactNode;
  navigateTo: string;
  onOpenTrailer: (url: string) => void;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container sx={{ mt: { xs: 4, sm: 6, md: 8 }, textAlign: "center" }}>
      <Box
        sx={{
          fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
          fontWeight: "bold",
          mb: { xs: 2, sm: 3 },
          color: "white",
        }}
      >
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.08}
        >
          {title}
        </ScrollFloat>
      </Box>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        style={{ width: "100%", paddingBottom: "20px" }}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <Box className="movie-card">
              <Box className="movie-image-container">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="movie-image"
                />
                <Box className="date-tag-container">
                  <Chip
                    icon={<CalendarTodayIcon />}
                    label={
                      <Box className="date-content">
                        <span className="month">APR</span>
                        <span className="full-date">04.04.2024</span>
                      </Box>
                    }
                    className="publish-date-tag"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      backgroundColor: "orange",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "3px 0 3px 0",
                      "& .MuiSvgIcon-root": {
                        color: "white",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="h6" className="movie-title">
                {movie.movieName}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 3,
                  mb: 2,
                }}
              >
                {/* View Trailer Button */}
                <Button
                  variant="text"
                  sx={{
                    backgroundColor: "transparent",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center", // Vertically center the icon and text
                    gap: 1,
                    whiteSpace: "nowrap", // Prevents text from wrapping
                    minWidth: "fit-content", // Ensures the button resizes based on content
                  }}
                  onClick={() => onOpenTrailer(movie.trailer)}
                >
                  <PlayCircleOutlineOutlinedIcon />
                  <span
                    style={{
                      textDecoration: "underline", // Add underline only to the text
                    }}
                  >
                    {t("view_trailer")}
                  </span>
                </Button>

                {/* Book Ticket Button */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "yellow",
                    color: "black",
                    fontWeight: "bold",
                    width: "120px",
                  }}
                  onClick={() =>
                    navigate(`/ticket/${movie.movieId}`)
                  }
                >
                  {t("book_ticket")}
                </Button>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      <Button
        onClick={() => navigate(navigateTo)}
        variant="contained"
        sx={{
          mt: 2,
          position: "relative",
          overflow: "hidden",
          bgcolor: "transparent",
          border: "2px solid yellow",
          color: "yellow",
          transition: "color 0.5s ease-in-out",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #e67e22,rgb(77, 91, 185))",
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
        <span>{t("see_more")}</span>
      </Button>
    </Container>
  );
};

const ListMovies: React.FC = () => {
  const { t } = useTranslation();
  const [nowShowingMovies, setNowShowingMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const page = 0;
  const pageSize = 6;

  const fetchNowShowingMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `movie/getmoviesnowshowing/page/${page}/pagesize/${pageSize}`,
      );
      console.log("Now showing movies:", response.data);
      setNowShowingMovies(response.data);
    } catch (error) {
      console.error("Error fetching now showing movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `movie/getmoviesupcoming/page/${page}/pagesize/${pageSize}`,
      );
      console.log("Upcoming movies:", response.data);
      setUpcomingMovies(response.data);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNowShowingMovies();
    fetchUpcomingMovies();
  }, []);

  const handleOpenTrailer = (url: string) => {
    let embedUrl = url.replace("youtu.be", "youtube.com/embed");
    embedUrl = embedUrl.replace("watch?v=", "embed/");
    embedUrl = embedUrl + "?autoplay=1";
    setTrailerUrl(embedUrl);
    setOpenTrailer(true);
  };

  const handleCloseTrailer = () => {
    setOpenTrailer(false);
    setTrailerUrl(null);
  };

  if (loading) return <Loader />;
  return (
    <Box sx={{ mt: 5, textAlign: "center" }}>
      {/* Now Showing Section */}
      <MovieSlider
        movies={nowShowingMovies}
        title={
          <Typography
            component="div"
            sx={{
              fontSize: "inherit",
              fontWeight: "inherit",
              color: "inherit",
            }}
          >
            {t("now_showing")}
          </Typography>
        }
        navigateTo="/movies/now-showing"
        onOpenTrailer={handleOpenTrailer}
      />

      {/* Upcoming Movies Section */}
      <MovieSlider
        movies={upcomingMovies}
        title={
          <Typography
            component="div"
            sx={{
              fontSize: "inherit",
              fontWeight: "inherit",
              color: "inherit",
            }}
          >
            {t("upcoming")}
          </Typography>
        }
        navigateTo="/movies/up-coming"
        onOpenTrailer={handleOpenTrailer}
      />

      {/* Trailer Modal */}
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
          {trailerUrl && (
            <iframe
              width="100%"
              height="100%"
              src={`${trailerUrl}`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ListMovies;
