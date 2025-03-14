import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fade, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fade in={isVisible}>
      <Box
        onClick={scrollToTop}
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 32,
          right: { xs: 16, sm: 32 },
          zIndex: 1000,
        }}
      >
        <IconButton
          aria-label="scroll to top"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            boxShadow: 3,
          }}
        >
          <KeyboardArrowUp fontSize="large" />
        </IconButton>
      </Box>
    </Fade>
  );
};

export default ScrollToTop;
