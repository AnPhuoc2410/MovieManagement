import { useQuery } from "react-query";
import { fetchThanhVien } from "../../../apis/mock.apis";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ManagementPageLayout from "../../../layouts/ManagementPageLayout";
import MemberTable, { ThanhVien } from "./BangThanhVien";

const QuanLiThanhVien: React.FC = () => {
  const {
    data: danhSachThanhVien = [],
    isLoading,
    error,
  } = useQuery<ThanhVien[]>(
    "thanhVienData", // Cache key
    fetchThanhVien,
  );

  const handleEdit = (id: string) => {
    console.log("Editing", id);
    // Add your edit logic here
  };

  const handleDelete = (id: string) => {
    console.log("Deleting", id);
    // Add your delete logic here
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Failed to fetch data</div>;

  return (
    <ManagementPageLayout
      children={
        <MemberTable
          employees={danhSachThanhVien}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      }
    />
  );
};

export default QuanLiThanhVien;
