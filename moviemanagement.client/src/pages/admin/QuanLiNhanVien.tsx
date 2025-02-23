import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

// Components
import AppNavbar from "../../components/mui/AppNavbar";
import Header from "../../components/mui/Header";
import SideMenu from "../../components/mui/SideMenu";

// Theme & Customizations
import AppTheme from "../../shared-theme/AppTheme";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import axios from "axios";

interface NhanVien {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

const QuanLiNhanVien: React.FC = ({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) => {
  const [danhSachNhanVien, setDanhSachNhanVien] = useState<NhanVien[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSampleNhanVien = async () => {
      try {
        const response = await axios.get<NhanVien[]>(
          "https://6512cbd2b8c6ce52b3963937.mockapi.io/api/v1/views",
        );
        setDanhSachNhanVien(response.data);
      } catch {
        console.log("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSampleNhanVien();
  }, []);

  const handleEdit = (id: number) => {
    console.log("Editing", id);
    // You can add your edit logic here, like opening a modal or navigating to an edit page
  };

  const handleDelete = (id: number) => {
    console.log("Deleting", id);
    // You can add your delete logic here, like showing a confirmation dialog and deleting the record
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <SideMenu />

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppNavbar />

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
              <Header />

              {/* Employee Table */}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {danhSachNhanVien.map((nhanVien) => (
                      <TableRow key={nhanVien.id}>
                        <TableCell>
                          <Avatar
                            src={nhanVien.avatar}
                            alt={nhanVien.username}
                          />
                        </TableCell>
                        <TableCell>{nhanVien.username}</TableCell>
                        <TableCell>{nhanVien.email}</TableCell>
                        <TableCell>{nhanVien.phone}</TableCell>
                        <TableCell>{nhanVien.address}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(nhanVien.id)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(nhanVien.id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default QuanLiNhanVien;
