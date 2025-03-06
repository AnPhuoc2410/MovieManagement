import React, { ReactNode } from "react";
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

const nowShowingMovies = [
  {
    title: "Kimi wo Aishita Hitori no Boku e (T16)",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx139311-5iHY459iwQ46.jpg",
  },
  {
    title: "Boku ga Aishita Subete no Kimi e (T16)",
    image:
      "https://screenbox.in/wp-content/uploads/2023/06/cropped-sgechfsdhgxcfghvcbgcdgsbu-jpeg.webp",
  },
  {
    title: "Tenki No Ko (T16)",
    image:
      "https://www.wheninmanila.com/wp-content/uploads/2019/06/D7rQ8bGX4AYrtLJ.jpeg",
  },
  {
    title: "Kimi no Na wa (T16)",
    image:
      "https://th.bing.com/th/id/OIP._rW1f9vUm1sm5uVtobKvYQHaK3?rs=1&pid=ImgDetMain",
  },
  {
    title: "Suzume no Tojimari (T16)",
    image: "https://www.posterhub.com.sg/images/detailed/134/80_1A_1B.jpg",
  },
  {
    title: "Spirited Away (T16)",
    image:
      "https://th.bing.com/th/id/OIP.uK0O7q8JA30sKMuwOrAsdQHaLN?rs=1&pid=ImgDetMain",
  },
  {
    title: "Pokemon Collection 22 (T16)",
    image: "https://i.ebayimg.com/images/g/la0AAOSwGKJf8y5s/s-l1600.jpg",
  },
  {
    title: "Captain America: Brave New World (T18)",
    image:
      "https://www.bhdstar.vn/wp-content/uploads/2025/02/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-2.jpg",
  },
  {
    title: "Minecraft: The Movie (T16)",
    image:
      "https://www.bhdstar.vn/wp-content/uploads/2025/02/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-22.jpg",
  },
];

const upcomingMovies = [
  {
    title: "Suzume no Tojimari (T16)",
    image: "https://www.posterhub.com.sg/images/detailed/134/80_1A_1B.jpg",
  },
  {
    title: "Spirited Away (T16)",
    image:
      "https://th.bing.com/th/id/OIP.uK0O7q8JA30sKMuwOrAsdQHaLN?rs=1&pid=ImgDetMain",
  },
  {
    title: "Captain America: Brave New World (T18)",
    image:
      "https://d2oi1rqwb0pj00.cloudfront.net/challenge/nio_1739276625112_100.webp",
  },
  {
    title: "Pokemon Heros The Movie (T16)",
    image:
      "https://th.bing.com/th/id/R.3689c865e31936ceee7588a094638911?rik=fXjX%2ferUrFzFRA&pid=ImgRaw&r=0",
  },
  {
    title: "Kimi wo Aishita Hitori no Boku e (T16)",
    image:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx139311-5iHY459iwQ46.jpg",
  },
  {
    title: "Boku ga Aishita Subete no Kimi e (T16)",
    image:
      "https://screenbox.in/wp-content/uploads/2023/06/cropped-sgechfsdhgxcfghvcbgcdgsbu-jpeg.webp",
  },
  {
    title: "Tenki No Ko (T16)",
    image:
      "https://www.wheninmanila.com/wp-content/uploads/2019/06/D7rQ8bGX4AYrtLJ.jpeg",
  },
  {
    title: "Kimi no Na wa (T16)",
    image:
      "https://th.bing.com/th/id/OIP._rW1f9vUm1sm5uVtobKvYQHaK3?rs=1&pid=ImgDetMain",
  },
  {
    title: "Suzume no Tojimari (T16)",
    image: "https://www.posterhub.com.sg/images/detailed/134/80_1A_1B.jpg",
  },
];

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
              <img
                src={movie.image}
                alt={movie.title}
                className="movie-image"
              />
              <Typography variant="h6" className="movie-title">
                {movie.title}
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
  return (
    <Box sx={{ backgroundColor: "#0B0D1A", color: "white" }}>
      {/* Now Showing Section */}
      <MovieSlider
        movies={nowShowingMovies}
        title=
        {
          <ScrollFloat
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
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
        title=
        {
          <ScrollFloat
            animationDuration={1}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
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
