import React, { ReactNode, useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ListMovies.css";
import "../../index.scss";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Scroll from "quill/blots/scroll";
import ScrollFloat from "../shared/ScrollFloat";
import LoadingSpinner from "../LoadingSpinner";
import toast from "react-hot-toast";
import api from "../../apis/axios.config";

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
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
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
              <img src={movie.image} alt={movie.name} className="movie-image" />
              <Typography variant="h6" className="movie-title">
                {movie.name}
              </Typography>
              <Button
                variant="contained"
                color="warning"
                className="book-button"
                onClick={() => navigate(`/showtime/${index}`)}
              >
                <span>{t("book_ticket")}</span>
              </Button>
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
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white" }}>
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
