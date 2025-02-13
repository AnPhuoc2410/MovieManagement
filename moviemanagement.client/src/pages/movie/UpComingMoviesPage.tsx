import React from "react";
import MovieList from "../../components/Movie/MovieList";
import { Box } from "@mui/material";
import Header from "../../components/Homepage/Header";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Footer from "../../components/Homepage/Footer";

const slides = [
  "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/1215x365.png",
  "https://api-website.cinestar.com.vn/media/MageINIC/bannerslider/1215wx365h_4_.jpg",
  "https://images.squarespace-cdn.com/content/v1/51b3dc8ee4b051b96ceb10de/a528ec50-cc70-46f0-a2e3-31b279594daa/spider-man-across-the-spider-verse-banner-features-an-epic-number-of-spider-people.jpg?format=1500w",
  "https://www.shmoti.com/ImageFiles/Image_555x271/20250211_Banner_CaptainAmericaSE20250211.jpg",
];

const upComingMovies = [
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

const UpComingMoviesPage: React.FC = () => {
  return (
    <Box
      sx={{ backgroundColor: "#0B0D1A", minHeight: "100vh", color: "white" }}
    >
      <Header />
      <Box sx={{ backgroundColor: "#0B0D1A", color: "white", pt: 10 }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop={true}
          style={{ width: "100%", height: "auto" }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "initial",
                  borderRadius: "10px",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <MovieList movies={upComingMovies} title="PHIM SẮP CHIẾU" buttonText="TÌM HIỂU THÊM"/>
      <Footer />
    </Box>
  );
};

export default UpComingMoviesPage;
