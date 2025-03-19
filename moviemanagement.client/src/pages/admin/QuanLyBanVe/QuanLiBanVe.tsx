import EditIcon from "@mui/icons-material/Edit";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import ManagementPageLayout from "../../../layouts/ManagementLayout";

const QuanLiBanVe: React.FC = () => {
  const navigate = useNavigate();

  // Fetch danh sách vé
  const {
    data: tickets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await fetch(
        "https://67d7d3cf9d5e3a10152c2879.mockapi.io/api/ticketdetail/all/getAllTicket",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch ticket details");
      }
      return response.json();
    },
  });

  // Xử lý khi nhấn nút chỉnh sửa
  const handleEdit = (id: string) => {
    navigate(`/admin/ban-ve/${id}`);
  };

  // Cấu hình cột bảng
  const columns: GridColDef[] = [
    { field: "ticketId", headerName: "ID Vé", width: 100 },
    { field: "Tên Phim", headerName: "Tên Phim", width: 250 },
    { field: "Người Mua", headerName: "Người Mua", width: 180 },
    { field: "Ngày Chiếu", headerName: "Ngày Chiếu", width: 220 },
    { field: "Giờ Chiếu", headerName: "Giờ Chiếu", width: 130 },
    { field: "Giá", headerName: "Giá (VND)", width: 130, type: "number" },
    {
      field: "actions",
      headerName: "Hành động",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Chỉnh sửa"
          onClick={() => handleEdit(params.row.ticketId)}
        />,
      ],
    },
  ];

  return (
    <ManagementPageLayout>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mr: 4, fontWeight: "bold" }}>
          Quản lý bán vé
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/admin/ban-ve/new")}
        >
          Thêm vé mới
        </Button>
      </Box>

      <Box sx={{ width: "100%", height: 600 }}>
        <DataGrid
          rows={tickets}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.ticketId}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>
    </ManagementPageLayout>
  );
};

export default QuanLiBanVe;
