import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import ManagementTable, {
  ColumnDef,
  TableData,
} from "../../../components/shared/ManagementTable";
import { useState } from "react";

export interface ThanhVien extends TableData {
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
  GioiTinh?: "Male" | "Female";
}

const MemberTable: React.FC<{
  employees: ThanhVien[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ employees, onEdit, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const columns: ColumnDef<ThanhVien>[] = [
    {
      field: "MaNhanVien",
      headerName: "Mã Thành Viên",
    },
    {
      field: "TenNhanVien",
      headerName: "Họ Tên",
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
      <Typography
        variant="h3"
        sx={{
          textAlign: "left",
        }}
      >
        Sửa tài khoản thành viên
      </Typography>
      <ManagementTable
        data={employees}
        columns={columns}
        onEdit={onEdit}
        actionColumn={{
          align: "center",
          headerName: "Hành động",
          width: "120px",
        }}
      />
    </>
  );
};

export default MemberTable;
