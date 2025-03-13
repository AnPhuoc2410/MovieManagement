import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Employee } from "./BangNhanVien";
import { UserResponse } from "../../../types/users.type";

interface XoaNhanVienProps {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  handleConfirmDelete: () => void;
  employeeData: UserResponse | null;
}

const XoaNhanVien = ({
  isDialogOpen,
  handleCloseDialog,
  handleConfirmDelete,
  employeeData,
}: XoaNhanVienProps) => {
  if (!employeeData) return null;

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Xác nhận xóa nhân viên</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xóa nhân viên {employeeData.fullName}? Hành động
          này không thể hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Hủy</Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default XoaNhanVien;
