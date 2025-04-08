import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../apis/axios.config";
import MovieDetail from "../../../components/admin/MovieDetail";
import Loader from "../../../components/shared/Loading";
import { useTranslation } from "react-i18next";

export default function UpdateMovie() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const { t } = useTranslation();

  const fetchMovie = async () => {
    try {
      console.log("MovieID: ", movieId);
      const response = await api.get(`/movie/${movieId}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ja",
        },
      });
      setMovie(response.data.data);
      console.log("Movie: ", response.data.data);
    } catch (error: any) {
      toast.error(t("toast.error.movie.loading_infor") + error.message);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId, t]);

  const handleUpdateMovie = async (updatedMovie: any) => {
    try {
      const response = await api.put(`/movie/${movieId}`, updatedMovie);
      toast.success(t("toast.success.movie.update"));
      console.log("Updated Movie: ", response.data.data);
      navigate(`/admin/ql-phim/${response.data.data.movieId}`); // Adjusted to access movieId directly from response.data
    } catch (error: any) {
      toast.error(t("toast.error.movie.update") + error.message);
    }
  };

  return (
    <div>
      {movie ? (
        <MovieDetail onSubmit={handleUpdateMovie} movie={movie} />
      ) : (
        <Loader />
      )}
    </div>
  );
}
