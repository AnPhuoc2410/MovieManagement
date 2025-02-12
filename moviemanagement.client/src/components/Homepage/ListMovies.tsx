import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ListMovies.css";

const nowShowingMovies = [
    {
        title: "Kimi wo Aishita Hitori no Boku e (T16)",
        image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx139311-5iHY459iwQ46.jpg",
    },
    {
        title: "Boku ga Aishita Subete no Kimi e (T16)",
        image: "https://screenbox.in/wp-content/uploads/2023/06/cropped-sgechfsdhgxcfghvcbgcdgsbu-jpeg.webp",
    },
    {
        title: "Tenki No Ko (T16)",
        image: "https://www.wheninmanila.com/wp-content/uploads/2019/06/D7rQ8bGX4AYrtLJ.jpeg",
    },
    {
        title: "Kimi no Na wa (T16)",
        image: "https://th.bing.com/th/id/OIP._rW1f9vUm1sm5uVtobKvYQHaK3?rs=1&pid=ImgDetMain",
    },
    {
        title: "Suzume no Tojimari (T16)",
        image: "https://www.posterhub.com.sg/images/detailed/134/80_1A_1B.jpg",
    },
    {
        title: "Spirited Away (T16)",
        image: "https://th.bing.com/th/id/OIP.uK0O7q8JA30sKMuwOrAsdQHaLN?rs=1&pid=ImgDetMain",
    },
    {
        title: "Pokemon Collection 22 (T16)",
        image: "https://i.ebayimg.com/images/g/la0AAOSwGKJf8y5s/s-l1600.jpg",
    },
    {
        title: "Pokemon Heros The Movie (T16)",
        image: "https://th.bing.com/th/id/R.3689c865e31936ceee7588a094638911?rik=fXjX%2ferUrFzFRA&pid=ImgRaw&r=0",
    },
];

const upcomingMovies = [
    {
        title: "Suzume no Tojimari (T16)",
        image: "https://www.posterhub.com.sg/images/detailed/134/80_1A_1B.jpg",
    },
    {
        title: "Spirited Away (T16)",
        image: "https://th.bing.com/th/id/OIP.uK0O7q8JA30sKMuwOrAsdQHaLN?rs=1&pid=ImgDetMain",
    },
    {
        title: "Pokemon Collection 22 (T16)",
        image: "https://i.ebayimg.com/images/g/la0AAOSwGKJf8y5s/s-l1600.jpg",
    },
    {
        title: "Pokemon Heros The Movie (T16)",
        image: "https://th.bing.com/th/id/R.3689c865e31936ceee7588a094638911?rik=fXjX%2ferUrFzFRA&pid=ImgRaw&r=0",
    },
    {
        title: "Kimi wo Aishita Hitori no Boku e (T16)",
        image: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx139311-5iHY459iwQ46.jpg",
    },
    {
        title: "Boku ga Aishita Subete no Kimi e (T16)",
        image: "https://screenbox.in/wp-content/uploads/2023/06/cropped-sgechfsdhgxcfghvcbgcdgsbu-jpeg.webp",
    },
    {
        title: "Tenki No Ko (T16)",
        image: "https://www.wheninmanila.com/wp-content/uploads/2019/06/D7rQ8bGX4AYrtLJ.jpeg",
    },
    {
        title: "Kimi no Na wa (T16)",
        image: "https://th.bing.com/th/id/OIP._rW1f9vUm1sm5uVtobKvYQHaK3?rs=1&pid=ImgDetMain",
    },
    {
        title: "Suzume no Tojimari (T16)",
        image: "https://www.posterhub.com.sg/images/detailed/134/80_1A_1B.jpg",
    },
];

const MovieSlider = ({ movies, title }: { movies: any[]; title: string }) => (
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
                        <img src={movie.image} alt={movie.title} className="movie-image" />
                        <Typography variant="h6" className="movie-title">{movie.title}</Typography>
                        <Button variant="contained" color="warning" className="book-button">
                            ĐẶT VÉ
                        </Button>
                    </Box>
                </SwiperSlide>
            ))}
        </Swiper>
    </Container>
);

const ListMovies: React.FC = () => {
    return (
        <Box sx={{ backgroundColor: "#0B0D1A", color: "white"}}>
            {/* Now Showing Section */}
            <MovieSlider movies={nowShowingMovies} title="PHIM ĐANG CHIẾU" />

            {/* Upcoming Movies Section */}
            <MovieSlider movies={upcomingMovies} title="PHIM SẮP CHIẾU" />
        </Box>
    );
};

export default ListMovies;
