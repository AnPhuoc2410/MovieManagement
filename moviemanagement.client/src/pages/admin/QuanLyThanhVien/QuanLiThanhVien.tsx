import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import { fetchThanhVien } from "../../../apis/mock.apis";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import MemberTable, { ThanhVien } from "./BangThanhVien";

const QuanLiThanhVien: React.FC = () => {
  const navigate = useNavigate();
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
      navigate(`/admin/ql-thanh-vien/${id}`);
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
    </ManagementPageLayout>
  );
};

export default QuanLiThanhVien;
