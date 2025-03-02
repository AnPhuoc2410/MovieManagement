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
import { Employee } from "./BangNhanVien";
import { useState, useRef, useEffect } from "react";

interface ChinhSuaNhanVienProps {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  employeeData: Employee | null;
}

const ChinhSuaNhanVien = ({
  isDialogOpen,
  handleCloseDialog,
  employeeData,
}: ChinhSuaNhanVienProps) => {
  // Track both the original URL and a preview URL (for newly uploaded files)
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set the initial image URL when component mounts or employeeData changes
  useEffect(() => {
    if (employeeData && employeeData.HinhAnh) {
      setImageUrl(employeeData.HinhAnh);
    }
  }, [employeeData]);

  if (!employeeData) return null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);

      // Create a URL for the image preview
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      setImageFile(file);
    }
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = () => {
    // Here you would typically save the form data
    // If imageFile exists, you'd upload it to your server
    // Otherwise, you'd use the existing imageUrl

    console.log("Image to save:", imageFile || imageUrl);

    // After saving, close the dialog
    handleCloseDialog();
  };

  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md">
      <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Hình ảnh"
            variant="standard"
            value={imageUrl || ''}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton component="label">
                  <FileUploadOutlined />
                  <input
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleUpload}
                    name="[licenseFile]"
                  />
                </IconButton>
              ),
            }}
          />

          {/* Image Preview */}
          {imageUrl && (
            <Box sx={{
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Box
                component="img"
                src={imageUrl}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  mt: 1
                }}
              />
              <Button
                size="small"
                color="error"
                onClick={handleRemoveImage}
                sx={{ mt: 1 }}
              >
                Xóa hình
              </Button>
            </Box>
          )}
        </Box>

        <TextField
          label="Tài khoản"
          variant="standard"
          fullWidth
          margin="normal"
          defaultValue={employeeData.TaiKhoan}
        />
        <TextField
          label="Họ tên"
          variant="standard"
          fullWidth
          margin="normal"
          defaultValue={employeeData.TenNhanVien}
        />
        <TextField
          label="Ngày sinh"
          variant="standard"
          fullWidth
          margin="normal"
          type="date"
          defaultValue={employeeData.NgaySinh}
          InputLabelProps={{
            style: { top: "-1.5rem" },
          }}
        />
        <Box sx={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          justifyContent: "flex-start",
        }}>
          <Typography>Giới tính</Typography>
          <RadioGroup
            defaultValue={employeeData.GioiTinh || "Male"}
            sx={{ display: "flex", gap: 10, flexDirection: "row" }}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Nam" />
            <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
          </RadioGroup>
        </Box>
        <TextField
          label="Email"
          variant="standard"
          fullWidth
          margin="normal"
          defaultValue={employeeData.Email}
        />
        <TextField
          label="Số CMND"
          variant="standard"
          fullWidth
          margin="normal"
          defaultValue={employeeData.SoCMND}
        />
        <TextField
          label="Số điện thoại"
          variant="standard"
          fullWidth
          margin="normal"
          defaultValue={employeeData.SoDienThoai}
        />
        <TextField
          label="Địa chỉ"
          variant="standard"
          fullWidth
          margin="normal"
          defaultValue={employeeData.DiaChi}
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