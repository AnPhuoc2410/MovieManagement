import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { doInActiveUser, fetchUserByRole, Role } from "../../../apis/user.apis";
import ManagementTable, {
  ColumnDef,
  defaultUserColumns,
} from "../../../components/shared/ManagementTable";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import { UserResponse } from "../../../types/users.type";
import XoaNhanVien from "./XoaNhanVien";
import { useQuery } from "react-query";

const QuanLiNhanVien: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState<UserResponse | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", "employees"],
    queryFn: async () => {
      const response = await fetchUserByRole(Role.Employee);
      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to fetch employees");
      }
      return response.data;
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load employees",
      );
    }
  }, [error]);

  const handleEdit = (id: string) => {
    navigate(`/admin/ql-nhan-vien/${id}`);
  };

  const handleDelete = (id: string) => {
    const employeeToDelete = employees?.find((emp) => emp.userId === id);
    if (employeeToDelete) {
      setSelectedEmployee(employeeToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee) {
      try {
        const res = await doInActiveUser(selectedEmployee.userId);
        if (res) {
          toast.success("Employee deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const columns: ColumnDef<UserResponse>[] = [
    ...defaultUserColumns,
    {
      field: "joinDate",
      headerName: "Join Date",
      align: "center",
      renderCell: (item) => new Date(item.joinDate).toLocaleDateString(),
    },
  ];

  return (
    <ManagementPageLayout>
      <ManagementTable
        data={employees}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
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
