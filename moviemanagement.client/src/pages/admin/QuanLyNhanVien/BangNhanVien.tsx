import { Box, Button, TextField, Typography } from "@mui/material";

import { useState } from "react";
import ManagementTable, {
  ColumnDef,
  TableData,
} from "../../../components/shared/ManagementTable";
import ThemNhanVien from "./ThemNhanVien";

export interface Employee extends TableData {
  MaNhanVien: string;
  TenNhanVien: string;
  SoCMND: string;
  Email: string;
  SoDienThoai: string;
  DiaChi: string;
  HinhAnh?: string;
  TaiKhoan?: string;
  MatKhau?: string;
  NgaySinh?: string;
  GioiTinh?: 'Male' | 'Female';
}

const EmployeeTable: React.FC<{
  employees: Employee[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ employees, onEdit, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns: ColumnDef<Employee>[] = [
    {
      field: "MaNhanVien",
      headerName: "Mã Nhân Viên",
    },
    {
      field: "TenNhanVien",
      headerName: "Tên Nhân Viên",
    },
    {
      field: "SoCMND",
      headerName: "Số CMND",
    },
    {
      field: "Email",
      headerName: "Email",
    },
    {
      field: "SoDienThoai",
      headerName: "Số Điện Thoại",
    },
    {
      field: "DiaChi",
      headerName: "Địa Chỉ",
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "left",
            flexGrow: 1, // Allow this to take extra space if needed
          }}
        >
          Danh sách thông tin nhân viên
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            flexShrink: 0, // Prevent button from shrinking
          }}
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          Thêm nhân viên
        </Button>
        <TextField
          label=""
          variant="outlined"
          size="small"
          sx={{
            width: "300px", // Keep the width fixed
            flexShrink: 0, // Prevent shrinking on small screens
          }}
        />
      </Box>

      <ManagementTable
        data={employees}
        columns={columns}
        onEdit={(id) => {
          console.log("Editing:", id);
          onEdit(id);
        }}
        onDelete={(id) => {
          console.log("Deleting:", id);
          onDelete(id);
        }}
        actionColumn={{
          align: "center",
          headerName: "Hành động",
          width: "120px",
        }}
      />

      <ThemNhanVien
        isDialogOpen={isDialogOpen}
        handleCloseDialog={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default EmployeeTable;
