import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import AppNavbar from "../../../components/mui/AppNavbar";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import toast from "react-hot-toast";


interface SoldTicket {
  ticketId: string;
  movieName: string;
  showTime: string;
  seat: string;
  price: number;
  buyer: string;
  purchaseDate: string;
}

export default function SoldTicket({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) {
  const [soldTickets, setSoldTickets] = useState<SoldTicket[]>([]);

  useEffect(() => {
    async function fetchSoldTickets() {
      try {
        const response = await axios.get(
          "https://localhost:7119/api/tickets/sold"
        );
        setSoldTickets(response.data);
      } catch (error) {
        console.error("Error fetching sold tickets:", error);
      }
    }
    fetchSoldTickets();
  }, []);

  const handleDelete = async (ticketId: string) => {
    try {
      await axios.delete(`https://localhost:7119/api/tickets/${ticketId}`, {
        headers: { "Content-Type": "application/json" },
      });
      setSoldTickets(soldTickets.filter((ticket) => ticket.ticketId !== ticketId));
      toast.success("Đã xóa vé thành công");
    } catch (error) {
      toast.error(`Lỗi xóa vé: ${error}`);
    }
  };

  const columns: GridColDef[] = [
    { field: "ticketId", headerName: "ID", width: 100 },
    { field: "movieName", headerName: "Tên Phim", flex: 1 },
    {
      field: "showTime",
      headerName: "Suất Chiếu",
      width: 150,
      renderCell: (params) => (
        <span>{params.value ? dayjs(params.value).format("DD/MM/YYYY HH:mm") : ""}</span>
      ),
    },
    { field: "seat", headerName: "Ghế", width: 100 },
    { field: "price", headerName: "Giá Vé (VND)", width: 130 },
    { field: "buyer", headerName: "Người Mua", flex: 1 },
    {
      field: "purchaseDate",
      headerName: "Ngày Mua",
      width: 150,
      renderCell: (params) => (
        <span>{params.value ? dayjs(params.value).format("DD/MM/YYYY") : ""}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Chức năng",
      width: 150,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.ticketId)}>
          <DeleteIcon color="error" />
        </IconButton>
      ),
    },
  ];

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <SideMenu />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Top Navigation Bar */}
          <AppNavbar />

          {/* Page Content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflowY: "auto",
              px: 3,
              py: 2,
            })}
          >
            <Stack spacing={2} alignItems="center">
              <Typography variant="h4" fontWeight="bold">
                Quản Lý Vé Đã Bán
              </Typography>

              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={soldTickets}
                  columns={columns}
                  pageSizeOptions={[5, 10, 20]}
                  getRowId={(row) => row.ticketId}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
