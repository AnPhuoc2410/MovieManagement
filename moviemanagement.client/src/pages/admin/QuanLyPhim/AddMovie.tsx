import MovieDetail from "../../../components/admin/MovieDetail";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../apis/axios.config";
import { t } from "i18next";
import { useAuth } from "../../../contexts/AuthContext";


export default function AddMovie() {
  const navigate = useNavigate();
  const { userDetails } = useAuth();


  const handleAddMovie = async (movieData: any) => {
    try {
      // console.log(movieData);
      const response = await api.post(`movie?userId=${userDetails?.userId}`, movieData);
      console.log(response.data.data);
      toast.success(t("toast.success.movie.add"));
      navigate(`/admin/ql-phim/${response.data.data.movieId}`);
    } catch (error: any) {
      toast.error(t("toast.error.movie.add") + error.message);
      console.log(error.message);
    }
  };

  return <MovieDetail onSubmit={handleAddMovie} />;
}
