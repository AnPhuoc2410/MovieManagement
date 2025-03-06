import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AppTheme from "../../../shared-theme/AppTheme";
import SideMenu from "../../../components/mui/SideMenu";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import { useNavigate } from "react-router";

interface Booking {
  bookingId: string;
  memberId: string;
  fullName: string;
  idCard: string;
  phone: string;
  movie: string;
  showTime: string;
}

const bookings: Booking[] = [
  {
    bookingId: "BV00001",
    memberId: "TV00001",
    fullName: "Nguyễn Long",
    idCard: "191816354",
    phone: "0935991771",
    movie: "Harry Potter",
    showTime: "29/01/2017 8:40",
  },
  {
    bookingId: "BV00001",
    memberId: "TV00001",
    fullName: "Nguyễn Long",
    idCard: "191816354",
    phone: "0935991771",
    movie: "Harry Potter",
    showTime: "29/01/2017 8:40",
  },
];

const QuanLyDatVe: React.FC = ({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) => {
  const navigate = useNavigate();

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
              <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                  Quản lý đặt vé
                </Typography>

                {/* Search Input */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    width: "40%",
                  }}
                >
                  <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                  <IconButton sx={{ ml: 1 }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                </Box>

                {/* Table */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã đặt vé</TableCell>
                        <TableCell>Mã thành viên</TableCell>
                        <TableCell>Họ tên</TableCell>
                        <TableCell>CMND</TableCell>
                        <TableCell>Số điện thoại</TableCell>
                        <TableCell>Phim</TableCell>
                        <TableCell>Xuất chiếu</TableCell>
                        <TableCell></TableCell> {/* For action button */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.bookingId}>
                          <TableCell>{booking.bookingId}</TableCell>
                          <TableCell>{booking.memberId}</TableCell>
                          <TableCell>{booking.fullName}</TableCell>
                          <TableCell>{booking.idCard}</TableCell>
                          <TableCell>{booking.phone}</TableCell>
                          <TableCell>{booking.movie}</TableCell>
                          <TableCell>{booking.showTime}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => {
                                navigate(
                                  `/admin/ql-dat-ve/${booking.bookingId}`,
                                );
                              }}
                            >
                              Nhận vé
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default QuanLyDatVe;
