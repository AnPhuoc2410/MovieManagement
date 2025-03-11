import {
  Box,
  Typography,
  Button,
  Grid,
  Link,
  Container,
  IconButton,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { FastfoodOutlined } from "@mui/icons-material";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useAuth } from "../../contexts/AuthContext";

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        background:
          "linear-gradient(to right, rgba(74, 20, 140, 0.9), rgba(235, 195, 50, 0.9))",
        backdropFilter: "blur(8px)",
        color: "white",
        padding: { xs: "20px 10px", sm: "30px 15px", md: "40px 20px" },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "inherit",
          zIndex: -1,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="space-between"
        >
          {/* Brand Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              EIGA
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t("footer.slogan")}
            </Typography>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              fullWidth
              sx={{
                display: { xs: "none", md: "flex" },
                fontWeight: "bold",
                position: "relative",
                overflow: "hidden",
                bgcolor: "yellow",
                color: "black",
                transition: "color 0.5s ease-in-out",
                minWidth: "auto",
                px: 2,
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
                  whiteSpace: "nowrap",
                },
              }}
              startIcon={<LocalActivityOutlinedIcon />}
            >
              <span>{t("footer.book_ticket")}</span>
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              fullWidth
              sx={{
                display: { xs: "none", md: "flex" },
                fontWeight: "bold",
                position: "relative",
                overflow: "hidden",
                bgcolor: "#834bff",
                color: "white",
                transition: "color 0.5s ease-in-out",
                minWidth: "auto",
                px: 2,
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
                  whiteSpace: "nowrap",
                },
              }}
              startIcon={<FastfoodOutlined />}
            >
              <span>{t("footer.book_snacks")}</span>
            </Button>
            <Typography variant="subtitle2" gutterBottom>
              {t("footer.social_media")}:
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton color="inherit" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <YouTubeIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
          {/* Account & Movies Section */}
          {!isAuthenticated && (
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t("footer.account.title")}
              </Typography>
              {["login", "register", "membership"].map((item) => (
                <Typography key={item} variant="body2" gutterBottom>
                  <Link
                    href="#"
                    color="inherit"
                    sx={{ textDecoration: "none" }}
                  >
                    {t(`footer.account.${item}`)}
                  </Link>
                </Typography>
              ))}

              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ mt: 3 }}
              >
                {t("footer.movies.title")}
              </Typography>
              {["now_showing", "coming_soon", "special_screening"].map(
                (item) => (
                  <Typography key={item} variant="body2" gutterBottom>
                    <Link
                      href="#"
                      color="inherit"
                      sx={{ textDecoration: "none" }}
                    >
                      {t(`footer.movies.${item}`)}
                    </Link>
                  </Typography>
                ),
              )}
            </Grid>
          )}
          {/* Theaters Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {t("footer.theaters.title")}
            </Typography>
            {[
              "all_theaters",
              "quoc_thanh",
              "hai_ba_trung",
              "binh_duong",
              "da_lat",
            ].map((item) => (
              <Typography key={item} variant="body2" gutterBottom>
                <Link href="#" color="inherit" sx={{ textDecoration: "none" }}>
                  {t(`footer.theaters.${item}`)}
                </Link>
              </Typography>
            ))}
          </Grid>
          {/* Legal Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {t("footer.legal.title")}
            </Typography>
            {["terms", "privacy", "faq", "about_us", "contact"].map((item) => (
              <Typography key={item} variant="body2" gutterBottom>
                <Link href="#" color="inherit" sx={{ textDecoration: "none" }}>
                  {t(`footer.legal.${item}`)}
                </Link>
              </Typography>
            ))}
          </Grid>
        </Grid>

        {/* Map */}
        <Box
          sx={{
            mt: { xs: 3, sm: 4, md: 5 },
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5400730334272!2d106.83740207489461!3d10.846466057898201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317521af4730391f%3A0xfa0bd6efed6cc3f9!2sS10.06%20Origami%2C%20Vinhomes%20Grandpark!5e0!3m2!1svi!2s!4v1740818652811!5m2!1svi!2s"
            sx={{
              width: { xs: "100%", sm: "90%", md: "70%" },
              height: { xs: 200, sm: 300, md: 400 },
              border: 0,
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              mt: 2,
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            textAlign: "center",
            mt: { xs: 3, sm: 4 },
            pt: 2,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="body2">{t("footer.copyright")}</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
