import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useQuery } from "react-query";
import { fetchThanhVien } from "../../../apis/mock.apis";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ManagementPageLayout from "../../../layouts/ManagementPageLayout";
import EmployeeTable, { Employee } from "./BangNhanVien";
import { Button } from "@mui/material";

const QuanLiNhanVien: React.FC = () => {
  const {
    data: danhSachNhanVien = [],
    isLoading,
    error,
  } = useQuery<Employee[]>(
    "NhanVienData", // Cache key
    fetchThanhVien,
  );

  const handleAdd = () => {
    console.log("Prepare to add ");
  };

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
    <>
      <Button variant="contained" onClick={handleAdd}>
        Add Nhan Vien
      </Button>
      <ManagementPageLayout
        children={
          <EmployeeTable
            employees={danhSachNhanVien}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        }
      />
    </>
  );
};

export default QuanLiNhanVien;
