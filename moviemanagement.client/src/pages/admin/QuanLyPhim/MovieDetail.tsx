import {
  Box,
  Button,
  CssBaseline,
  MenuItem,
  Select,
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  FormControl,
  InputLabel,
  InputAdornment, // Add InputAdornment import
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import TextEdit from "../../../components/admin/TextEdit";
import AppNavbar from "../../../components/mui/AppNavbar";
import SideMenu from "../../../components/mui/SideMenu";

import CloudinaryUploadWidget from "../../../components/cloudinary/CloudinaryUploadWidget";

import dayjs from "dayjs";
import { ENV } from "../../../env/env.config";
import AppTheme from "../../../shared-theme/AppTheme";
import toast from "react-hot-toast";
import Header from "../../../components/mui/Header";
import ScrollFloat from "../../../components/shared/ScrollFloat";
import {
  DateField,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Movie } from "@mui/icons-material";
import { MovieRatings } from "../../../data/movieRating.data";
import { MovieVersions } from "../../../data/movieVersion.data";

interface Movie {
  movieId?: string;
  movieName: string;
  image?: string;
  postDate: string;
  fromDate: string;
  toDate: string;
  actors: string;
  director: string;
  rating: number;
  duration: number;
  version: string;
  trailer: string;
  content: string;
  userId: string;
  categoriesIds: string[];
}

export default function MovieDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie: Movie | undefined = location.state?.movie;
  const ratings = MovieRatings;
  const versions = MovieVersions;

  const { watch, control, handleSubmit, reset, setValue } = useForm<Movie>({
    defaultValues: {
      movieName: "",
      image: "",
      postDate: "",
      fromDate: "",
      toDate: "",
      actors: "",
      director: "",
      rating: 0,
      duration: 0,
      version: "",
      trailer: "",
      content: "",
      userId: "",
      categoriesIds: [],
    },
  });

  useEffect(() => {
    if (movie) {
      reset(movie);
    }
  }, [movie, reset]);

  const uwConfig = {
    cloudName: ENV.CLOUDINARY_CLOUD_NAME,
    uploadPreset: "movie_up",
  };

  const [uploadedImage, setUploadedImage] = useState<string>(
    movie?.image || "",
  );
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories from API
    axios.get("https://localhost:7119/api/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handleSetPublicId = (publicId: string) => {
    const imageUrl = `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    setUploadedImage(imageUrl);
    setValue("image", imageUrl);
  };

  const onSubmit = async (data: Movie) => {
    try {
      const payload = {
        ...data,
        movieId: data.movieId ? data.movieId : null,
        postDate: dayjs(data.postDate).toISOString(),
        fromDate: dayjs(data.fromDate).toISOString(),
        toDate: dayjs(data.toDate).toISOString(),
      };

      if (data.movieId) {
        await axios.put(
          `https://localhost:7119/api/movies/${data.movieId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        toast.success("Cập nhật phim thành công", { removeDelay: 3000 });
      } else {
        await axios.post("https://localhost:7119/api/movies", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Thêm phim mới thành công", { removeDelay: 3000 });
      }

      setTimeout(() => {
        navigate("/admin/phim");
      }, 3000);
    } catch (error) {
      toast.error(`Lỗi khi lưu phim: ${error}`);
    }
  };

  return (
    <AppTheme disableCustomTheme={false}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <SideMenu />

        {/* Main Content Area */}
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
            <Stack spacing={2}>
              <Header />
              <Container
                maxWidth="xl"
                sx={{
                  pt: { xs: "64px", sm: "72px", md: "80px" },
                  pb: { xs: 4, sm: 6, md: 8 },
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 5, md: 6 } }}>
                  <ScrollFloat
                    animationDuration={1}
                    ease="back.inOut(2)"
                    scrollStart="center bottom+=50%"
                    scrollEnd="bottom bottom-=40%"
                    stagger={0.08}
                  >
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{
                        textTransform: "uppercase",
                      }}
                    >
                      {movie ? "Cập Nhật Phim" : "Thêm Phim Mới"}
                    </Typography>
                  </ScrollFloat>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="movieName"
                    control={control}
                    rules={{ required: "Tên phim không được để trống" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tên phim"
                        margin="dense"
                        variant="outlined"
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                  <Controller
                    name="fromDate"
                    control={control}
                    rules={{ required: "Vui lòng chọn ngày khởi chiếu" }}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Ngày khởi chiếu"
                          {...field}
                          value={
                            field.value
                              ? dayjs(field.value, "YYYY-MM-DD")
                              : null
                          }
                          onChange={(date) =>
                            field.onChange(date?.format("YYYY-MM-DD") || "")
                          }
                          slotProps={{
                            textField: {
                              size: "small",
                              margin: "dense",
                              error: !!error,
                              helperText: error ? error.message : "",
                            },
                          }}
                          format="DD/MM/YYYY"
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <Controller
                    name="toDate"
                    control={control}
                    rules={{ required: "Vui lòng chọn ngày kết thúc" }}
                    render={({ field, fieldState: { error } }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Ngày kết thúc"
                          {...field}
                          value={
                            field.value
                              ? dayjs(field.value, "YYYY-MM-DD")
                              : null
                          }
                          onChange={(date) =>
                            field.onChange(date?.format("YYYY-MM-DD") || "")
                          }
                          slotProps={{
                            textField: {
                              size: "small",
                              margin: "dense",
                              sx: { ml: 2 }, // Add left margin
                              error: !!error,
                              helperText: error ? error.message : "",
                            },
                          }}
                          format="DD/MM/YYYY"
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <Controller
                    name="director"
                    control={control}
                    rules={{ required: "Đạo diễn không được để trống" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Đạo diễn"
                        margin="dense"
                        variant="outlined"
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                  <Controller
                    name="actors"
                    control={control}
                    rules={{ required: "Diễn viên không được để trống" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Diễn viên"
                        margin="dense"
                        variant="outlined"
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: "Chọn phân loại độ tuổi" }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        error={!!error}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Phân loại độ tuổi
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                        >
                          {ratings.map((version) => (
                            <MenuItem key={version} value={version}>
                              {version}
                            </MenuItem>
                          ))}
                        </Select>
                        {error && (
                          <Typography variant="caption" color="error">
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="version"
                    control={control}
                    rules={{ required: "Chọn phiên bản" }}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl
                        fullWidth
                        margin="dense"
                        variant="outlined"
                        error={!!error}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Phiên bản
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                        >
                          {versions.map((version) => (
                            <MenuItem key={version} value={version}>
                              {version}
                            </MenuItem>
                          ))}
                        </Select>
                        {error && (
                          <Typography variant="caption" color="error">
                            {error.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="duration"
                    control={control}
                    rules={{
                      min: { value: 1, message: "Thời lượng không được để trống" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Thời lượng"
                        type="number"
                        margin="dense"
                        variant="outlined"
                        value={field.value || null} 
                        error={!!error}
                        helperText={error ? error.message : ""}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">phút</InputAdornment>
                          ), 
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="categoriesIds"
                    control={control}
                    render={({ field }) => (
                      <Box>
                        {categories.map((category) => (
                          <FormControlLabel
                            key={category}
                            control={
                              <Checkbox
                                color="secondary"
                                checked={field.value.includes(category)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, category]
                                    : field.value.filter(
                                        (id) => id !== category,
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={category}
                          />
                        ))}
                      </Box>
                    )}
                  />
                  {/* Cloudinary Upload Section */}
                  <Box sx={{ my: 2 }}>
                    <CloudinaryUploadWidget
                      uwConfig={uwConfig}
                      setPublicId={handleSetPublicId}
                    />
                    {uploadedImage && (
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          style={{ maxWidth: "100%", maxHeight: 150 }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Button type="submit" variant="contained">
                    {movie ? "Cập Nhật Phim" : "Thêm Phim"}
                  </Button>
                </form>
              </Container>
            </Stack>
            <Button onClick={() => navigate("/admin/phim")}>Trở lại</Button>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
