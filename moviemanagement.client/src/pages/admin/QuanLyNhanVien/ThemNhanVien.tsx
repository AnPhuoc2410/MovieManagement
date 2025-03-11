import {
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { FileUploadOutlined } from "@mui/icons-material";

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

const handleUploadFuction = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    console.log(file);
  }

  e.target.value = "";
};

const onCancel = () => {
  console.log("Cancel");
};

const onSave = () => {
  console.log("Save");
};

const ThemNhanVienMoi: React.FC = ({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) => {
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
                <Paper elevation={2} sx={{ p: 4, mt: 2, mb: 4 }}>
                  <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
                    Thêm nhân viên mới
                  </Typography>

                  <Box component="form" sx={{ mt: 2 }}>
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
                        my: 2,
                      }}
                    >
                      <Typography>Giới tính</Typography>
                      <RadioGroup
                        defaultValue="Male"
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
                    />
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

                    <Box
                      sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Button
                        onClick={onCancel}
                        color="error"
                        variant="contained"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={onSave}
                        color="primary"
                        variant="contained"
                      >
                        Lưu
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Container>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ThemNhanVienMoi;
