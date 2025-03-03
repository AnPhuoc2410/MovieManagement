import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Room } from "../../../types/room.types";

interface ChinhSuaNhanVienProps {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  roomData: Room | null;
}

const ChinhSuaNhanVien = ({
  isDialogOpen,
  handleCloseDialog,
  roomData,
}: ChinhSuaNhanVienProps) => {
  if (!roomData) return null;

  const handleSaveChanges = () => {
    // Here you would typically save the form data
    // If imageFile exists, you'd upload it to your server
    // Otherwise, you'd use the existing imageUrl

    // After saving, close the dialog
    handleCloseDialog();
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md">
      <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
      <DialogContent>
        <TextField
          label="Tài khoản"
          variant="standard"
          fullWidth
          margin="normal"
          defaultValue={roomData.roomId}
        />
        <TextField
          label="Họ tên"
          variant="standard"
          fullWidth
          margin="normal"
          defaultValue={roomData.name}
        />
        <TextField
          label="Ngày sinh"
          variant="standard"
          fullWidth
          margin="normal"
          type="date"
          defaultValue={roomData.total}
          InputLabelProps={{
            style: { top: "-1.5rem" },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="error">
          Hủy
        </Button>
        <Button onClick={handleSaveChanges} color="primary">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChinhSuaNhanVien;
