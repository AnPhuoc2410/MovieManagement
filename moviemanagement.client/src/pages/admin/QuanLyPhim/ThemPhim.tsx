import { FileUploadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getCategoryList } from "../../../apis/mock.apis";
import { Category } from "../../../types/category.types";

import type { } from "@mui/x-charts/themeAugmentation";
import type { } from "@mui/x-data-grid-pro/themeAugmentation";
import type { } from "@mui/x-date-pickers/themeAugmentation";
import * as React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";
import AppTheme from "../../../shared-theme/AppTheme";
import { useTranslation } from "react-i18next";
import api from "../../../apis/axios.config";
import toast from "react-hot-toast";

// Components
const ThemPhim: React.FC = ({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleUpload = () => {
    console.log("Upload");
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      // If already selected, remove it
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      }
      // Otherwise add it
      else {
        return [...prev, categoryId];
      }
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("category");
      console.log(response.data.data);
      setCategories(response.data.data);
    } catch (error: any) {
      toast.error("Lỗi khi tải thể loại: " + error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [t]);

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
              <Container
                sx={{
                  backgroundColor: "#f5f5f5",
                  color: "#000000",
                  py: 3,
                }}
              >
                <Typography variant="h3">Thêm phim</Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
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
                        sx={{ mt: 1 }}
                        onClick={() => setImageUrl(null)}
                      >
                        Xóa hình
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Other form fields */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Tên phim
                  </Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>

                {/* More fields */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Từ ngày
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="date"
                  />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Đến ngày
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="date"
                  />
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Diễn viên
                  </Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Hãng phim
                  </Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Đạo diễn
                  </Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Thời lượng
                  </Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Phiên bản
                  </Typography>
                  <RadioGroup row>
                    <FormControlLabel
                      value="2D"
                      control={<Radio />}
                      label="2D"
                    />
                    <FormControlLabel
                      value="3D"
                      control={<Radio />}
                      label="3D"
                    />
                  </RadioGroup>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Trailer
                  </Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>

                <Box sx={{ mt: 3 }}>
                  <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">
                      <Typography variant="subtitle1">Thể Loại</Typography>
                    </FormLabel>
                    <FormGroup
                      sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <FormControlLabel
                            key={category.categoryId}
                            control={
                              <Checkbox
                                checked={selectedCategories.includes(
                                  category.categoryId,
                                )}
                                onChange={() =>
                                  handleCategoryChange(category.categoryId)
                                }
                                name={`category-${category.categoryId}`}
                              />
                            }
                            label={category.name}
                            sx={{ width: "33%", minWidth: "150px" }}
                          />
                        ))
                      ) : (
                        <Typography color="text.secondary">
                          Loading categories...
                        </Typography>
                      )}
                    </FormGroup>
                  </FormControl>
                </Box>

                {/* More fields continued */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Phòng chiếu
                  </Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Lịch chiếu
                  </Typography>
                  <TextField
                    sx={{
                      width: "20%",
                    }}
                    variant="outlined"
                    size="small"
                  />
                  <Button variant="contained"> Thêm giờ chiếu</Button>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Nội dung
                  </Typography>
                  <TextField fullWidth variant="outlined" multiline rows={4} />
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    gap: 2,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ minWidth: 100, textAlign: "right", paddingRight: 2 }}
                  >
                    Mã NV
                  </Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ minWidth: 200 }}
                    onClick={() =>
                      console.log("Selected categories:", selectedCategories)
                    }
                  >
                    Submit
                  </Button>
                </Box>
              </Container>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default ThemPhim;
