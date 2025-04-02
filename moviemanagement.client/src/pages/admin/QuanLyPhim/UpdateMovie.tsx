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
  const {t} = useTranslation();

  const fetchMovie = async () => {
    try {
      console.log("MovieID: ", movieId);
      const response = await api.get(`/movie/${movieId}`);
      setMovie(response.data.data);
      console.log("Movie: ", response.data.data);
    } catch (error: any) {
      toast.error("Lỗi khi tải thông tin phim: " + error.message);
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
      toast.success("Cập nhật phim thành công!");
      console.log("Updated Movie: ", response.data);
      navigate(`/admin/ql-phim/${response.data.movieId}`); // Adjusted to access movieId directly from response.data
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật phim: " + error.message);
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
