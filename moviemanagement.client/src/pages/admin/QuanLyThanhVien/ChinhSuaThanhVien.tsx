import { FileUploadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { fetchThanhVienDetail } from "../../../apis/mock.apis";
import Loader from "../../../components/shared/Loading";
import { ThanhVien } from "./BangThanhVien";

import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";

const ChinhSuaThanhVien: React.FC = ({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) => {
  const { id } = useParams();

  const {
    data: memberData = null,
    isLoading,
    error,
  } = useQuery<ThanhVien>("MemberData", () =>
    fetchThanhVienDetail(id as string),
  );

  // Track both the original URL and a preview URL (for newly uploaded files)
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set the initial image URL when component mounts or memberData changes
  useEffect(() => {
    if (memberData && memberData.HinhAnh) {
      setImageUrl(memberData.HinhAnh);
    }
  }, [memberData]);

  if (!memberData) return null;

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;
  if (!memberData) return <div>No employee data found</div>;

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
  };

  const handleCancel = () => {
    console.log("Canceling changes");
    // Navigate back to previous page
    // navigate(-1);
  };

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
              <Container maxWidth="md">
                <Box sx={{ py: 4 }}>
                  <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
                    Chỉnh sửa thông tin nhân viên
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Hình ảnh"
                      variant="standard"
                      value={imageUrl || ""}
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
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={imageUrl}
                          alt="Preview"
                          sx={{
                            maxWidth: "100%",
                            maxHeight: "200px",
                            objectFit: "contain",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            mt: 1,
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
                    defaultValue={memberData.TaiKhoan}
                  />
                  <TextField
                    label="Họ tên"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    defaultValue={memberData.TenNhanVien}
                  />
                  <TextField
                    label="Ngày sinh"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    type="date"
                    defaultValue={memberData.NgaySinh}
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
                      my: 2,
                    }}
                  >
                    <Typography>Giới tính</Typography>
                    <RadioGroup
                      defaultValue={memberData.GioiTinh || "Male"}
                      sx={{ display: "flex", gap: 10, flexDirection: "row" }}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio />}
                        label="Nữ"
                      />
                    </RadioGroup>
                  </Box>
                  <TextField
                    label="Email"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    defaultValue={memberData.Email}
                  />
                  <TextField
                    label="Số CMND"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    defaultValue={memberData.SoCMND}
                  />
                  <TextField
                    label="Số điện thoại"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    defaultValue={memberData.SoDienThoai}
                  />
                  <TextField
                    label="Địa chỉ"
                    variant="standard"
                    fullWidth
                    margin="normal"
                    defaultValue={memberData.DiaChi}
                  />

                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                    }}
                  >
                    <Button
                      onClick={handleCancel}
                      color="error"
                      variant="contained"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      color="primary"
                      variant="contained"
                    >
                      Lưu thay đổi
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ChinhSuaThanhVien;
