import { Box, Typography, Button, Grid, Link } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #4A148C,rgb(235, 195, 50))",
        color: "white",
        padding: "40px 20px",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Left Section */}
        <Grid item xs={12} md={4} textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            EIGA
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            BE HAPPY, BE A STAR
          </Typography>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
              position: "relative",
              overflow: "hidden",
              bgcolor: "yellow",
              color: "black",
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
            <span> ĐẶT VÉ</span>
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            sx={{
              ml: 2,
              position: "relative",
              overflow: "hidden",
              bgcolor: "#834bff",
              color: "white",
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
            <span>ĐẶT BẮP NƯỚC</span>
          </Button>
          <Box sx={{ mt: 2 }}>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              Facebook
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              YouTube
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              TikTok
            </Link>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Ngôn ngữ: 🇻🇳 VN
          </Typography>
        </Grid>

        {/* Center Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold">
            TÀI KHOẢN
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Đăng nhập
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Đăng ký
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Membership
            </Link>
          </Typography>

          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            XEM PHIM
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Phim đang chiếu
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Phim sắp chiếu
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Suất chiếu đặc biệt
            </Link>
          </Typography>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight="bold">
            HỆ THỐNG RẠP
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Tất cả hệ thống rạp
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Rạp Quốc Thanh
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Rạp Hai Bà Trưng
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Rạp Bình Dương
            </Link>
          </Typography>
          <Typography variant="body2">
            <Link href="#" color="inherit">
              Rạp Đà Lạt
            </Link>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ textAlign: "center", mt: 4, display: "flex", justifyContent: "center" }}>
        <Box
          component="iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5400730334272!2d106.83740207489461!3d10.846466057898201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317521af4730391f%3A0xfa0bd6efed6cc3f9!2sS10.06%20Origami%2C%20Vinhomes%20Grandpark!5e0!3m2!1svi!2s!4v1740818652811!5m2!1svi!2s"
          sx={{
            width: { xs: "90%", md: "70%" },
            height: { xs: 250, md: 400 },
            border: 0,
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body2">
          © 2025 EIGA. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Chính sách bảo mật | Tin điện ảnh | Hỏi và đáp
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
