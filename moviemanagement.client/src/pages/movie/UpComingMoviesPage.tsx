import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Button, Chip, Modal, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import Aurora from "../../components/shared/Aurora";
import ScrollToTop from "../../components/common/ScrollToTop";
import Loader from "../../components/shared/Loading";
import api from "../../apis/axios.config";
import { format, parseISO } from "date-fns";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ScrollFloat from "../../components/shared/ScrollFloat";

const UpComingMoviesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [upComingMovies, setUpComingMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  // For API pagination
  const apiPage = 0;
  const apiPageSize = 100; // Fetch more to handle client-side pagination

  useEffect(() => {
    const fetchUpComingMovies = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/movie/coming-soon/page/${apiPage}/size/${apiPageSize}`
        );
        console.log("Now showing movies:", response.data);
        setUpComingMovies(response.data);
      } catch (error) {
        console.error("Error fetching now showing movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpComingMovies();
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

  // Pagination logic
  const pageCount = Math.ceil(upComingMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = upComingMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <Loader />;
  }

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
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Title with animation */}
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
                textTransform: "uppercase",
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              }}
            >
              {t("now_showing")}
            </Typography>
          </ScrollFloat>
        </Box>

        {/* Movies Grid */}
        <Grid container spacing={3}>
          {currentMovies.map((movie, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                className="movie-card"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  backgroundColor: "rgba(28, 28, 28, 0.6)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
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
                      height: { xs: "200px", sm: "250px", md: "300px" },
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

                  {/* Date Tag */}
                  <Chip
                    icon={<CalendarTodayIcon />}
                    label={
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                          {format(parseISO(movie.postDate), "MMM")}
                        </Typography>
                        <Typography variant="caption">
                          {format(parseISO(movie.postDate), "dd, yyyy")}
                        </Typography>
                      </Box>
                    }
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

                {/* Movie Info */}
                <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      height: "3em",
                      textAlign: "center",
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                    }}
                  >
                    {movie.movieName}
                  </Typography>

                  {/* Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: "auto",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* View Trailer Button */}
                    <Button
                      variant="text"
                      sx={{
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        "&:hover": {
                          color: "#FFD700",
                        },
                      }}
                      onClick={() => handleOpenTrailer(movie.trailer)}
                    >
                      <PlayCircleOutlineOutlinedIcon />
                      <Typography
                        variant="button"
                        sx={{
                          textDecoration: "underline",
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
                        }}
                      >
                        {t("view_trailer")}
                      </Typography>
                    </Button>

                    {/* Book Ticket Button */}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "yellow",
                        color: "black",
                        fontWeight: "bold",
                        transition: "transform 0.3s ease, background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: "#FFD700",
                          transform: "scale(1.05)",
                        },
                      }}
                      onClick={() => navigate(`/ticket/${movie.movieId}`)}
                    >
                      {t("book_ticket")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
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
              }}
            />
          </Box>
        )}
      </Container>

      {/* Trailer Modal */}
      <Modal
        open={openTrailer}
        onClose={handleCloseTrailer}
        closeAfterTransition
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
              src={trailerUrl}
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

      <ScrollToTop />
      <Footer />
    </Box>
  );
};

export default UpComingMoviesPage;
