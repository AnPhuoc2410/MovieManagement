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
import api from "../../../apis/axios.config";
import { Category } from "../../../types/category.types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"; // Import DeleteForeverIcon

interface Movie {
  movieId?: string;
  movieName: string;
  image?: string;
  postDate: string;
  fromDate: string;
  toDate: string;
  actors: string;
  director: string;
  rating: string;
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
      rating: "",
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
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("category/all");
      console.log(response.data);
      setCategories(response.data);
    } catch (error: any) {
      toast.error("Lỗi khi tải thể loại: " + error.message);
    }
  };

  useEffect(() => {
    fetchCategories(); // Use the new fetchCategories function
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
                  pt: { xs: "64px", sm: "72px", md: "10px" },
                  pb: { xs: 4, sm: 6, md: 8 },
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 5, md: 1 } }}>
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
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left Box with Fields */}
                    <Box sx={{ flex: 1, maxWidth: 700 }}>
                      {" "}
                      {/* Reduced width */}
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
                            sx={{ mt: 3 }} // Added margin-top
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
                                  fullWidth: true, // Match width to parent box
                                },
                              }}
                              format="DD/MM/YYYY"
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <Box>
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
                                  field.onChange(
                                    date?.format("YYYY-MM-DD") || "",
                                  )
                                }
                                slotProps={{
                                  textField: {
                                    size: "small",
                                    margin: "dense",
                                    error: !!error,
                                    helperText: error ? error.message : "",
                                    fullWidth: true, // Match width to parent box
                                  },
                                }}
                                format="DD/MM/YYYY"
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Box>
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
                              {ratings.map((rating) => (
                                <MenuItem key={rating} value={rating}>
                                  {rating}
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
                          min: {
                            value: 1,
                            message: "Thời lượng không được để trống",
                          },
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
                                <InputAdornment position="end">
                                  phút
                                </InputAdornment>
                              ),
                            }}
                          />
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
                    </Box>

                    {/* Right Box with Cloudinary Upload Section */}
                    <Box>
                      <Controller
                        name="image"
                        control={control}
                        rules={{
                          required: "Vui lòng cập nhật ảnh",
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Box
                            component="section"
                            sx={{
                              mr: 5,
                              p: 2,
                              width: 250,
                              maxHeight: "100%", // Match height with the left box
                              border: "1px dashed grey",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Box sx={{ mt: 1, mb: 1, position: "relative" }}>
                              <img
                                src={
                                  field.value ||
                                  uploadedImage ||
                                  "https://lh3.googleusercontent.com/proxy/eyweV2OAAOQOPKLAO51xBA1NJmnzv_6_Py10QJaddFLuSx42Ebf1OHUlMyxyW6G-acvTbxsT7phMBH7xTqdLyDw_5dW5kymvT-Q"
                                }
                                alt="Uploaded"
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                              />
                              {uploadedImage && (
                                <Button
                                  onClick={() => {
                                    setUploadedImage("");
                                    field.onChange(""); // Clear the field value
                                  }}
                                  sx={{
                                    position: "absolute",
                                    top: 5,
                                    right: 5,
                                    minWidth: "auto",
                                    padding: 0,
                                  }}
                                  color="error"
                                >
                                  <DeleteForeverIcon />
                                </Button>
                              )}
                            </Box>
                            <CloudinaryUploadWidget
                              uwConfig={uwConfig}
                              setPublicId={(publicId) => {
                                const imageUrl = `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
                                setUploadedImage(imageUrl);
                                field.onChange(imageUrl); // Update the field value
                              }}
                            />
                            {error && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1 }}
                              >
                                {error.message}
                              </Typography>
                            )}
                          </Box>
                        )}
                      />
                    </Box>
                  </Stack>

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
                        sx={{ mt: 3 }} // Added margin-top
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />

                  <Controller
                    name="trailer"
                    control={control}
                    rules={{ required: "Trailer không được để trống" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Link trailer"
                        margin="dense"
                        variant="outlined"
                        error={!!error}
                        helperText={error ? error.message : ""}
                      />
                    )}
                  />
                  <Controller
                    name="categoriesIds"
                    control={control}
                    rules={{
                      validate: (value) =>
                        value.length > 0 || "Vui lòng chọn ít nhất 1 thể loại",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Thể loại
                        </Typography>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                          }}
                        >
                          {categories.map((category, index) => (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  checked={field.value.includes(
                                    category.categoryId,
                                  )}
                                  onChange={(e) => {
                                    const newValue = e.target.checked
                                      ? [...field.value, category.categoryId]
                                      : field.value.filter(
                                          (id) => id !== category.categoryId,
                                        );
                                    field.onChange(newValue);
                                  }}
                                />
                              }
                              label={category.name}
                            />
                          ))}
                        </Box>
                        {error && (
                          <Typography variant="caption" color="error">
                            {error.message}
                          </Typography>
                        )}
                      </Box>
                    )}
                  />
                  <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Nội dung không được để trống",
                      validate: (value) =>
                        value.trim() !== "" || "Nội dung không được để trống",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        {" "}
                        {/* Added margin top */}
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {" "}
                          {/* Added header */}
                          Nội dung
                        </Typography>
                        <TextEdit
                          value={field.value}
                          onChange={(val) => field.onChange(val)}
                          error={error?.message}
                        />
                      </Box>
                    )}
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <Button type="submit" variant="contained">
                      {movie ? "Cập Nhật Phim" : "Thêm Phim"}
                    </Button>
                  </Box>
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
