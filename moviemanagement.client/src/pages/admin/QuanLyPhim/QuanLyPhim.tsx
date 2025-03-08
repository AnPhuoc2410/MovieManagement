import { useQuery } from "react-query";
import { getFilmList } from "../../../apis/mock.apis";
import Loader from "../../../components/shared/Loading";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import { QuanLyPhimType } from "../../../types/movie.types";
import FilmTable from "./BangPhim";
import { useNavigate } from "react-router";

const QuanLyPhim = () => {
  const navigate = useNavigate();
  const {
    data: danhSachPhim = [],
    isLoading,
    error,
  } = useQuery<QuanLyPhimType[]>("QuanLyPhimData", () => getFilmList("all"));

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;

  const handleEdit = (id: string) => {
    console.log("Handling edit for ID:", id);
    const movie = danhSachPhim.find((it) => it.movieId === id);
    if (movie) {
      navigate(`/admin/ql-phim/${id}`);
    }
  };

  return (
    <ManagementPageLayout>
      <FilmTable data={danhSachPhim} onEdit={handleEdit} />
    </ManagementPageLayout>
  );
};

export default QuanLyPhim;
