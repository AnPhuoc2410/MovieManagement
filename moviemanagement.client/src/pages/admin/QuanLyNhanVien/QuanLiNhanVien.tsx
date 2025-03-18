import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Button, Chip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { doInActiveUser, fetchUserByRole, Role } from "../../../apis/user.apis";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import { UserResponse } from "../../../types/users.type";
import XoaNhanVien from "./XoaNhanVien";
import { dateFormatter } from "../../../utils/dateTime.utils";

const QuanLiNhanVien: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
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
  }, [error, location]);

  const handleEdit = (id: string) => navigate(`/admin/ql-nhan-vien/${id}`);

  const handleDelete = (username: string) => {
    const employeeToDelete = employees?.find(
      (emp) => emp.userName === username,
    );
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
          toast.success(t("toast.employee.deleteSuccess"));
        }
      } catch (error) {
        toast.error(t("toast.employee.deleteFailed"));
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "userName",
        headerName: t("common.table_header.user.username"),
        width: 250,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={params.row.avatar || "/default-avatar.png"}
              alt={params.row.fullName}
            />
            <span>{params.row.userName}</span>
          </Box>
        ),
      },
      {
        field: "fullName",
        headerName: t("common.table_header.user.fullname"),
        width: 180,
      },
      {
        field: "email",
        headerName: t("common.table_header.user.email"),
        width: 220,
      },
      {
        field: "phoneNumber",
        headerName: t("common.table_header.user.phone"),
        width: 130,
      },
      {
        field: "status",
        headerName: t("common.table_header.user.status"),
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.row.status === 1 ? "Active" : "Inactive"}
            color={params.row.status === 1 ? "success" : "error"}
            sx={{
              fontWeight: "bold",
              borderRadius: "16px",
              minWidth: "80px",
            }}
          />
        ),
      },
      {
        field: "address",
        headerName: t("common.table_header.user.address"),
        width: 130,
      },
      {
        field: "actions",
        headerName: t("common.table_header.actions"),
        type: "actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEdit(params.row.userId)}
          />,
          params.row.status === 1 && (
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDelete(params.row.userName)}
              showInMenu
            />
          ),
        ],
      },
    ],
    [t],
  );

  return (
    <ManagementPageLayout>
      <Button
        sx={{
          marginBottom: "20px",
          marginLeft: "auto",
          color: "black",
          borderColor: "black",
        }}
        onClick={() => {
          navigate("/admin/ql-nhan-vien/them-moi");
        }}
      >
        Thêm nhân viên
      </Button>
      <Box
        sx={{
          width: "100%",
          height: 600,
          "& .MuiDataGrid-root": {
            border: "none",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 1,
            "& .MuiDataGrid-columnHeaders": {
              color: "black",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
        }}
      >
        <DataGrid
          rows={employees || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.userId}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
        />
      </Box>

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
