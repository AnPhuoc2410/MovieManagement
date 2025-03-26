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
import NowShowingMovies from "../../components/Movie/NowShowingMovies";

const NowShowingMoviesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [nowShowingMovies, setNowShowingMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  // For API pagination
  const apiPage = 0;
  const apiPageSize = 100; // Fetch more to handle client-side pagination

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/movie/showing/page/${apiPage}/size/${apiPageSize}`
        );
        console.log("Now showing movies:", response.data);
        setNowShowingMovies(response.data);
      } catch (error) {
        console.error("Error fetching now showing movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowShowingMovies();
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
  const pageCount = Math.ceil(nowShowingMovies.length / moviesPerPage);
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = nowShowingMovies.slice(indexOfFirstMovie, indexOfLastMovie);

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

      <NowShowingMovies />
      <Footer />
    </Box>
  );
};

export default NowShowingMoviesPage;
