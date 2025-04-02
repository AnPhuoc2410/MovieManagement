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
import { format, parseISO } from "date-fns";

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
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={movies.length > 4}
        style={{ width: "100%", paddingBottom: "20px" }}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <Box className="movie-card">
              <Box className="movie-image-container">
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "8px",
                    backgroundColor: "#222",
                    height: { xs: "200px", sm: "250px", md: "300px" },
                    width: "100%",
                  }}
                >
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="movie-image"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "blur(10px)",
                      transition: "filter 0.5s ease-in-out",
                    }}
                    onLoad={(e) => (e.currentTarget.style.filter = "none")}
                  />
                </Box>

                <Box className="date-tag-container">
                  <Chip
                    icon={<CalendarTodayIcon />}
                    label={
                      <Box className="date-content">
                        <span className="month">
                          {format(parseISO(movie.postDate), "MMM")}
                        </span>
                        <span className="full-date">
                          {format(parseISO(movie.postDate), "dd, yyyy")}
                        </span>
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
              <Typography
                variant="h6"
                className="movie-title"
                sx={{
                  height: "3em",
                  mb: 1,
                  mt: 1,
                  width: "100%",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
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
                    alignItems: "center",
                    gap: 1,
                    whiteSpace: "nowrap",
                    minWidth: "fit-content",
                  }}
                  onClick={() => onOpenTrailer(movie.trailer)}
                >
                  <PlayCircleOutlineOutlinedIcon />
                  <span
                    style={{
                      textDecoration: "underline",
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
                    transition:
                      "transform 0.3s ease, background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#FFD700",
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={() => navigate(`/ticket/${movie.movieId}`)}
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
        `movie/showing/page/${page}/size/${pageSize}`,
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
        `movie/coming-soon/page/${page}/size/${pageSize}`,
      );
      console.log("Upcoming movies:", response.data);
      setUpcomingMovies(response.data.data);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true);
      await Promise.all([
        fetchNowShowingMovies(),
        fetchUpcomingMovies()
      ]);
    };

    fetchAllMovies();
  }, [t]);

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
        closeAfterTransition
        keepMounted
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(0, 0, 0, 0.8)",
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
          {/* Close Button */}
          <Button
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: "50%",
              minWidth: "40px",
              height: "40px",
              zIndex: 10,
              "&:hover": {
                backgroundColor: "rgba(255,0,0,0.7)",
              },
            }}
            onClick={handleCloseTrailer}
          >
            ✖
          </Button>

          {/* Trailer Video */}
          {trailerUrl && (
            <iframe
              width="100%"
              height="100%"
              src={`${trailerUrl}`}
              title="Movie Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                borderRadius: "10px",
              }}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ListMovies;
