import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { fetchUserByRole, Role } from "../../../apis/user.apis";
import ManagementTable, {
  ColumnDef,
  defaultUserColumns,
} from "../../../components/shared/ManagementTable";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import { UserResponse } from "../../../types/users.type";
import { useQuery } from "react-query";

const QuanLiThanhVien: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", "members"],
    queryFn: async () => {
      const response = await fetchUserByRole(Role.Member);
      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to fetch members");
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
    navigate(`/admin/ql-thanh-vien/${id}`);
  };

  const columns: ColumnDef<UserResponse>[] = [
    ...defaultUserColumns,
    {
      field: "point",
      headerName: "Points",
      align: "center",
    },
  ];

  return (
    <ManagementPageLayout>
      <ManagementTable
        data={users}
        columns={columns}
        onEdit={handleEdit}
        isLoading={isLoading}
      />
    </ManagementPageLayout>
  );
};

export default QuanLiThanhVien;
