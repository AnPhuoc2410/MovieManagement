import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { FileUploadOutlined } from "@mui/icons-material";

interface ThemNhanVienProps {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
}

const handleUploadFuction = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    console.log(file);
  }

  e.target.value = "";
};

const ThemNhanVien = ({
  isDialogOpen,
  handleCloseDialog,
}: ThemNhanVienProps) => {
  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md">
      <DialogTitle>Thêm nhân viên mới</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Hình ảnh"
          variant="standard"
          type="text"
          InputProps={{
            endAdornment: (
              <IconButton component="label">
                <FileUploadOutlined />
                <input
                  style={{ display: "none" }}
                  type="file"
                  hidden
                  onChange={handleUploadFuction}
                  name="[licenseFile]"
                />
              </IconButton>
            ),
          }}
        />
        {/* Rest of your form fields */}
        <TextField
          label="Tài khoản"
          variant="standard"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mật khẩu"
          variant="standard"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Nhập lại mật khẩu"
          variant="standard"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Họ tên"
          variant="standard"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Ngày sinh"
          variant="standard"
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{
            style: { top: "-1.5rem" },
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography>Giới tính</Typography>
          <RadioGroup
            defaultValue="Male"
            sx={{ display: "flex", gap: 10, flexDirection: "row" }}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Nam" />
            <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
          </RadioGroup>
        </Box>
        <TextField label="Email" variant="standard" fullWidth margin="normal" />
        <TextField
          label="Số CMND"
          variant="standard"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Số điện thoại"
          variant="standard"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Địa chỉ"
          variant="standard"
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="error">
          Hủy
        </Button>
        <Button onClick={handleCloseDialog} color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThemNhanVien;
