import { useState } from "react";
import { useQuery } from "react-query";
import { fetchThanhVien } from "../../../apis/mock.apis";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import MemberTable, { ThanhVien } from "./BangThanhVien";
import ChinhSuaThanhVien from "./ChinhSuaThanhVien";

const QuanLiThanhVien: React.FC = () => {
  const {
    data: danhSachThanhVien = [],
    isLoading,
    error,
  } = useQuery<ThanhVien[]>(
    "thanhVienData", // Cache key
    fetchThanhVien,
  );

  const [selectedEmployee, setSelectedEmployee] = useState<ThanhVien | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (id: string) => {
    console.log("Handling edit for ID:", id);
    const employee = danhSachThanhVien.find((emp) => emp.MaNhanVien === id);
    if (employee) {
      setSelectedEmployee(employee);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Handling delete for ID:", id);
    const employee = danhSachThanhVien.find((emp) => emp.MaNhanVien === id);
    if (employee) {
      setSelectedEmployee(employee);
    }
  };

  return (
    <ManagementPageLayout>
      <MemberTable
        employees={danhSachThanhVien}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ChinhSuaThanhVien
        isDialogOpen={isEditDialogOpen}
        handleCloseDialog={() => {
          setIsEditDialogOpen(false);
          setSelectedEmployee(null);
        }}
        memberData={selectedEmployee}
      />
    </ManagementPageLayout>
  );
};

export default QuanLiThanhVien;
