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
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getCategoryList, getFilmDetail } from "../../../apis/mock.apis";
import Loader from "../../../components/shared/Loading";
import { Category } from "../../../types/category.types";
import { Movie } from "../../../types/movie.types";

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

// Components
const ChinhSuaPhim: React.FC = ({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fix the query key to include the ID for proper caching
  const {
    data: filmDetail,
    isLoading,
    error,
  } = useQuery<Movie>(
    ["MovieDetailData", id], // Use array syntax with ID for unique query key
    () => getFilmDetail(id as string),
    {
      enabled: !!id,
    },
  );

  const [imageUrl, setImageUrl] = useState<string | null>(
    "https://i.pinimg.com/550x/2e/74/01/2e74015286f261ee4fea125c17597640.jpg",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryList();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;
  if (!filmDetail) return <div>No movie found with ID: {id}</div>;

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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 5,
                  }}
                >
                  <TextField
                    sx={{
                      width: "30%",
                      whiteSpace: "pre-line", // Giúp chuyển xuống dòng
                      overflow: "hidden", // Ẩn phần text dư ra
                      textOverflow: "ellipsis", // Thêm dấu "..." nếu text vượt quá
                    }}
                    margin="normal"
                    label="Hình ảnh"
                    variant="standard"
                    value={imageUrl || ""}
                    multiline={true} // Cho phép nhiều dòng
                    minRows={1} // Số dòng tối thiểu
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
                          maxHeight: "300px",
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
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Tên phim</Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>

                {/* More fields */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Từ ngày</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="date"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Đến ngày</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="date"
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Diễn viên</Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Hãng phim</Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Đạo diễn</Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Thời lượng</Typography>
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

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Trailer</Typography>
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
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Phòng chiếu</Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Lịch chiếu</Typography>
                  <TextField fullWidth variant="outlined" size="small" />
                  <Button sx={{ mt: 2 }} variant="contained">
                    {" "}
                    Thêm giờ chiếu
                  </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Nội dung</Typography>
                  <TextField fullWidth variant="outlined" multiline rows={4} />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Mã NV</Typography>
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
                    Lưu thông tin
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

export default ChinhSuaPhim;
