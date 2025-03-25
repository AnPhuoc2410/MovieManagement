import MovieDetail from "../../../components/admin/MovieDetail";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../apis/axios.config";

export default function AddMovie() {
  const navigate = useNavigate();

  const handleAddMovie = async (movieData: any) => {
    try {
      console.log(movieData);
      const response = await api.post("movie", movieData);
      toast.success("Thêm phim mới thành công");
      navigate(`/admin/ql-phim/${response.data.movieId}`);
    } catch (error: any) {
      toast.error("Lỗi khi thêm phim mới: " + error.message);
      console.log(error.message);
    }
  };

  return <MovieDetail onSubmit={handleAddMovie} />;
}
