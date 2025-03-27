import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Chip, Grid, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router";
import { fetchUserByRole, Role } from "../../../apis/user.apis";
import ManagementPageLayout from "../../../layouts/ManagementLayout";

const QuanLiThanhVien: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
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
        error instanceof Error ? error.message : "Failed to load members",
      );
    }
  }, [error, location]);

  const handleEdit = (id: string) => navigate(`/admin/ql-thanh-vien/${id}`);

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
        field: "point",
        headerName: t("common.table_header.user.points"),
        width: 130,
        type: "number",
        align: "center",
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
        ],
      },
    ],
    [t],
  );

  return (
    <ManagementPageLayout>
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
              backgroundColor: "primary.main",
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
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Grid container spacing={2}>
            {[
              {
                id: 1,
                name: "Tổng số thành viên",
                description: "This is item 1",
              },
              {
                id: 2,
                name: "Tổng số thành viên đang hoạt động",
                description: "This is item 2",
              },
              { id: 3, name: "Item 3", description: "This is item 3" },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography>{item.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <DataGrid
          rows={users || []}
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
    </ManagementPageLayout>
  );
};

export default QuanLiThanhVien;
