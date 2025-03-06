import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Pagination,
} from "@mui/material";
import "./MovieList.css";
import { Link } from "react-router";

const MovieList = ({
  movies,
  title,
  buttonText,
}: {
  movies: any[];
  title: string;
  buttonText: string;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const moviesPerPage = 12;
  const pagesVisited = currentPage * moviesPerPage;

  const displayMovies = movies
    .slice(pagesVisited, pagesVisited + moviesPerPage)
    .map((movie, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Box className="movie-card">
          <Link to="/">
            <img src={movie.image} alt={movie.title} className="movie-image" />
            <Typography variant="h6" className="movie-title">
              <Box sx={{ mb: 2 }} />
              {movie.title}
            </Typography>
          </Link>
          <Box sx={{ mb: 2 }} />

          <Button
            variant="contained"
            color="warning"
            className="book-button"
            sx={{
              position: "relative",
              overflow: "hidden",
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
            <span>{buttonText}</span>
          </Button>
        </Box>
      </Grid>
    ));

  const pageCount = Math.ceil(movies.length / moviesPerPage);

  const changePage = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {displayMovies}
      </Grid>
      <Pagination
        count={pageCount}
        color="secondary"
        page={currentPage + 1}
        onChange={(event, value) => setCurrentPage(value - 1)}
        sx={{
          "& .Mui-selected": {
            height: "40px",
            width: "40px",
            borderRadius: "50%",
          },
          mt: 4,
          mb: 4,
          display: "flex",
          justifyContent: "center",
          "& .MuiPaginationItem-root": {
            fontSize: "1.4rem",
            color: "white",
            margin: "0 10px",
          },
        }}
      />
    </Container>
  );
};

export default MovieList;
