import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  Modal,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TranslateIcon from "@mui/icons-material/Translate";
import { useParams } from "react-router-dom";
import MovieList from "./MovieList";

const MovieDetail = () => {
  const [openTrailer, setOpenTrailer] = useState(false);

  // const { id } = useParams();

  // Trong thực tế, bạn sẽ fetch dữ liệu phim dựa trên id
  const movie = {
    title: "ĐÈN ÂM HỒN",
    genre: "Hồi Hộp, Kinh Dị",
    duration: "102'",
    country: "Việt Nam",
    language: "VN",
    rating: "T18",
    director: "Hoàng Nam",
    cast: "Diễm Trang, Hoàng Kim Ngọc, Phú Thịnh, NSƯT Chiếu Xuân, NSƯT Quang Tèo, Tuấn Mõ, Hạo Khang, Đình Khang...",
    releaseDate: "Thứ Ba, 04/02/2025",
    description:
      "Lấy cảm các từ Chuyện Người Con Gái Nam Xương, Đèn Âm Hồn xảy tại một ngôi làng miền Bắc vào thời phong kiến. Thương một mình nuôi con trai chờ chồng đi lính trở về. Lĩnh (con Thương) vô tình nhặt được một cây đèn, từ đó cậu gọi chiếc bóng hiện trên tường là cha. Theo lời của cô đồng trong làng, đây là cây đèn âm hồn, có thể đã triệu hồn một ác linh quay lại báo thù. Từ đây, những sự kiện bất thường ma quái xảy ra với Thương và cả dân làng. Liệu chiếc bóng đó có phải là chồng của Thương, cha của Lĩnh hay không?",
    image:
      "https://cinestar.com.vn/_next/image/?url=https%3A%2F%2Fapi-website.cinestar.com.vn%2Fmedia%2Fwysiwyg%2FPosters%2F01-2025%2Fden-am-hon-poster.png&w=2048&q=75",
  };

  const handleOpenTrailer = () => setOpenTrailer(true);
  const handleCloseTrailer = () => setOpenTrailer(false);

  return (
    <Box
      sx={{ backgroundColor: "#0B0D1A", minHeight: "100vh", color: "white" }}
    >
      <Container maxWidth="lg" sx={{ mt: 13, color: "white" }}>
        <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={movie.image}
              alt={movie.title}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                objectFit: "cover",
              }}
            />
          </Grid>

          {/* Movie Info */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h4" fontWeight="bold" mb={2}>
              {movie.title}
            </Typography>

            <Box sx={{ mb: 3, fontWeight: "bold" }}>
              <Chip label={movie.rating} color="error" sx={{ mb: 1, mr: 1 }} />

              <Chip
                icon={<AccessTimeIcon />}
                label={movie.duration}
                sx={{ mr: 1, mb: 1, color: "white" }}
              />
              <Chip
                icon={<LocationOnIcon />}
                label={movie.country}
                sx={{ mr: 1, mb: 1, color: "white" }}
              />
              <Chip
                icon={<TranslateIcon />}
                label={movie.language}
                sx={{ mr: 1, mb: 1, color: "white" }}
              />
              <Chip
                label={movie.genre}
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: "#e67e22",
                  color: "white",
                }}
              />
            </Box>

            <Typography variant="h6" fontWeight="bold" mb={2}>
              MÔ TẢ
            </Typography>

            <Box sx={{ mb: 3, textAlign: "justify", flexGrow: 1 }}>
              <Typography mb={1} variant="body1">
                <strong>Đạo diễn:</strong> {movie.director}
              </Typography>
              <Typography mb={1} variant="body1">
                <strong>Diễn viên:</strong> {movie.cast}
              </Typography>
              <Typography mb={1} variant="body1">
                <strong>Khởi chiếu:</strong> {movie.releaseDate}
              </Typography>
              <Typography variant="h6" fontWeight="bold" mb={2} mt={4}>
                NỘI DUNG PHIM
              </Typography>
              <Typography paragraph variant="body1">
                {movie.description}
              </Typography>
            </Box>
            <Box sx={{ mt: "auto" }}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleOpenTrailer}
                sx={{
                  color: "white",
                  borderColor: "#e67e22",
                  mr: 2,
                  position: "relative",
                  overflow: "hidden",
                  transition: "color 0.5s ease-in-out",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, #e67e22,rgb(77, 91, 185))",
                    transform: "translateX(-100%)",
                    transition: "transform 0.5s ease-in-out",
                    zIndex: 0,
                  },
                  "&:hover": {
                    color: "black",
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
                <span>XEM TRAILER</span>
              </Button>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#e67e22",
                  position: "relative",
                  overflow: "hidden",
                  transition: "color 0.5s ease-in-out",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, #e67e22,rgb(77, 91, 185))",
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
                <span>ĐẶT VÉ NGAY</span>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Thêm Modal cho trailer */}
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
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/E7exHaPHDeM?autoplay=1"
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default MovieDetail;
