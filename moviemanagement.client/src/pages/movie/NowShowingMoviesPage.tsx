import React from "react";
import MovieList from "../../components/Movie/MovieList";
import { Box, Container } from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import Aurora from "../../components/shared/Aurora";
import ScrollToTop from "../../components/common/ScrollToTop";

const slides = [
  "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/1215x365.png",
  "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/1215wx365h_4_.jpg",
  "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/a528ec50-cc70-46f0-a2e3-31b279594daa/spider-man-across-the-spider-verse-banner-features-an-epic-number-of-spider-people.jpg?format=1500w",
  "https://www.shmoti.com/ImageFiles/Image_555x271/20250211_Banner_CaptainAmericaSE20250211.jpg",
];

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
    title: "Pokemon Heros The Movie (T16)",
    image:
      "https://th.bing.com/th/id/R.3689c865e31936ceee7588a094638911?rik=fXjX%2ferUrFzFRA&pid=ImgRaw&r=0",
  },
];

const NowShowingMoviesPage: React.FC = () => {
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
        {/* Movie List */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <MovieList
            movies={nowShowingMovies}
            title="PHIM ĐANG CHIẾU"
            buttonText="ĐẶT VÉ"
          />
        </Box>
      </Container>

      <ScrollToTop />
      <Footer />
    </Box>
  );
};

export default NowShowingMoviesPage;
