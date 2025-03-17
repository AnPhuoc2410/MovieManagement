import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Box, Chip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import ManagementPageLayout from "../../../layouts/ManagementLayout";

const QuanLiThanhVien: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: tickets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await fetch("https://67d7d3cf9d5e3a10152c2879.mockapi.io/api/ticketdetail/all/getAllTicket");
      if (!response.ok) {
        throw new Error("Failed to fetch ticket details");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load tickets");
    }
  }, [error]);

  const handleEdit = (id: string) => navigate(`/admin/ql-thanh-vien/${id}`);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "Tên Phim",
        headerName: "Movie Name",
        width: 250,
      },
      {
        field: "Người Mua",
        headerName: "Buyer",
        width: 180,
      },
      {
        field: "Ngày Chiếu",
        headerName: "Show Date",
        width: 220,
      },
      {
        field: "Giờ Chiếu",
        headerName: "Show Time",
        width: 130,
      },
      {
        field: "Loại Ghế",
        headerName: "Seat Type",
        width: 120,
      },
      {
        field: "Phòng",
        headerName: "Room",
        width: 130,
      },
      {
        field: "Vị Trí",
        headerName: "Position",
        width: 130,
      },
      {
        field: "Giá",
        headerName: "Price",
        width: 130,
        type: "number",
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEdit(params.row.id)} />,
        ],
      },
    ],
    [],
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
          },
        }}
      >
        <DataGrid
          rows={tickets || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) =>
            row.id || `${row["Tên Phim"]}-${row["Người Mua"]}-${row["Giờ Chiếu"]}` || Math.random().toString(36).substr(2, 9)
          }
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
