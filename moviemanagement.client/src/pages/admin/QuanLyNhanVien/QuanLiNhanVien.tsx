import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { useState } from "react";
import { useQuery } from "react-query";
import { fetchNhanVien } from "../../../apis/mock.apis";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import EmployeeTable, { Employee } from "./BangNhanVien";
import ChinhSuaNhanVien from "./ChinhSuaNhanVien";
import XoaNhanVien from "./XoaNhanVien";

const QuanLiNhanVien: React.FC = () => {
  const {
    data: danhSachNhanVien = [],
    isLoading,
    error,
  } = useQuery<Employee[]>("NhanVienData", fetchNhanVien);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (id: string) => {
    console.log("Handling edit for ID:", id);
    const employee = danhSachNhanVien.find((emp) => emp.MaNhanVien === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Handling delete for ID:", id);
    const employee = danhSachNhanVien.find((emp) => emp.MaNhanVien === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedEmployee) {
      // Implement delete logic here
      console.log("Deleting employee:", selectedEmployee.MaNhanVien);
    }
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Failed to fetch data</div>;

  return (
    <ManagementPageLayout>
      <EmployeeTable
        employees={danhSachNhanVien}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ChinhSuaNhanVien
        isDialogOpen={isEditDialogOpen}
        handleCloseDialog={() => {
          setIsEditDialogOpen(false);
          setSelectedEmployee(null);
        }}
        employeeData={selectedEmployee}
      />

      <XoaNhanVien
        isDialogOpen={isDeleteDialogOpen}
        handleCloseDialog={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEmployee(null);
        }}
        handleConfirmDelete={handleConfirmDelete}
        employeeData={selectedEmployee}
      />
    </ManagementPageLayout>
  );
};

export default QuanLiNhanVien;
