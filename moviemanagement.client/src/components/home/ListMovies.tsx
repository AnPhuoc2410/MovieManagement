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

const MovieSlider = ({
  movies,
  title,
  navigateTo,
}: {
  movies: any[];
  title: ReactNode;
  navigateTo: string;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container sx={{ mt: 0, textAlign: "center", mb: 13 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 5 }}>
        {title}
      </Typography>
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
                {movie.name}
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
                  onClick={() => navigate(`/showtime/${index}`)}
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
  const page = 0;
  const pageSize = 6;

  const fetchNowShowingMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `Movie/GetMoviesNowShowing/page/${page}/pageSize/${pageSize}`,
      );
      console.log("Now showing movies:", response.data);
      setNowShowingMovies(response.data);
    } catch (error) {
      console.error("Error fetching now showing movies:", error);
      toast.error("Failed to fetch now showing movies");
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `Movie/GetMoviesUpcoming/page/${page}/pageSize/${pageSize}`,
      );
      console.log("Upcoming movies:", response.data);
      setUpcomingMovies(response.data);
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
      toast.error("Failed to fetch upcoming movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNowShowingMovies();
    fetchUpcomingMovies();
  }, []);

  if (loading) return <LoadingSpinner />;
  return (
    <Box sx={{ mt: 5, textAlign: "center" }}>
      {/* Now Showing Section */}
      <MovieSlider
        movies={nowShowingMovies}
        title={
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.07}
          >
            {t("now_showing")}
          </ScrollFloat>
        }
        navigateTo="/movies/now-showing"
      />

      {/* Upcoming Movies Section */}
      <MovieSlider
        movies={upcomingMovies}
        title={
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.08}
          >
            {t("upcoming")}
          </ScrollFloat>
        }
        navigateTo="/movies/up-coming"
      />
    </Box>
  );
};

export default ListMovies;
