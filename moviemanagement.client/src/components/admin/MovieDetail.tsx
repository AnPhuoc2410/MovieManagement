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

import TextEdit from "./TextEdit";
import AppNavbar from "../mui/AppNavbar";
import SideMenu from "../mui/SideMenu";

import CloudinaryUploadWidget from "../cloudinary/CloudinaryUploadWidget";

import dayjs from "dayjs";
import { ENV } from "../../env/env.config";
import AppTheme from "../../shared-theme/AppTheme";
import toast from "react-hot-toast";
import Header from "../mui/Header";
import ScrollFloat from "../shared/ScrollFloat";
import { DateField, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Movie } from "@mui/icons-material";
import { MovieRatings } from "../../data/movieRating.data";
import { MovieVersions } from "../../data/movieVersion.data";
import api from "../../apis/axios.config";
import { Category } from "../../types/category.types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"; // Import DeleteForeverIcon
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface Movie {
  movieId?: string;
  movieName: string;
  image?: string;
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

interface MovieDetailProps {
  onSubmit: (data: Movie) => void;
  movie?: any; // Add movie prop
}

export default function MovieDetail({ onSubmit, movie }: MovieDetailProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const ratings = MovieRatings;
  const versions = MovieVersions;
  const { userDetails } = useAuth();

  const { watch, control, handleSubmit, reset, setValue } = useForm<Movie>({
    defaultValues: {
      movieName: "",
      image: "",
      fromDate: "",
      toDate: "",
      actors: "",
      director: "",
      rating: "",
      duration: movie?.duration || undefined,
      version: "",
      trailer: "",
      content: "",
      userId: userDetails?.userId || "",
      categoriesIds: movie?.categories?.map((category: { categoryId: any }) => category.categoryId) || [],
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

  const [uploadedImage, setUploadedImage] = useState<string>(movie?.image || "");
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("category");
      console.log(response.data.data);
      setCategories(response.data.data);
    } catch (error: any) {
      toast.error(t("toast.error.category.loading") + error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [t]);

  const handleSetPublicId = (publicId: string) => {
    const imageUrl = `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    setUploadedImage(imageUrl);
    setValue("image", imageUrl);
  };

  const handleFormSubmit = (data: Movie) => {
    const payload = {
      ...data,
      fromDate: dayjs(data.fromDate).toISOString(),
      toDate: dayjs(data.toDate).toISOString(),
    };
    onSubmit(payload);
    setIsEditing(false); // Set isEditing to false after submission
  };

  const [isEditing, setIsEditing] = useState(!movie); // Default to true if no movie is provided

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
                  <ScrollFloat animationDuration={1} ease="back.inOut(2)" scrollStart="center bottom+=50%" scrollEnd="bottom bottom-=40%" stagger={0.08}>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      sx={{
                        textTransform: "uppercase",
                      }}
                    >
                      {movie ? t("movie_detail.more_detail") : t("movie_detail.add_new")}
                    </Typography>
                  </ScrollFloat>
                </Box>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Left Box with Fields */}
                    <Box sx={{ flex: 1, maxWidth: 750 }}>
                      {/* Reduced width */}
                      <Controller
                        name="movieName"
                        control={control}
                        rules={{ required: t("movie_detail.required.name") }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t("movie_detail.label.name")}
                            margin="dense"
                            variant="outlined"
                            sx={{ mt: 3 }} // Added margin-top
                            error={!!error}
                            helperText={error ? error.message : ""}
                            InputProps={{
                              readOnly: !isEditing, // Make readonly if not editing
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="fromDate"
                        control={control}
                        rules={{ required: t("movie_detail.required.showtime_selection") }}
                        render={({ field, fieldState: { error } }) => (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={t("movie_detail.label.showtime")}
                              {...field}
                              value={field.value ? dayjs(field.value, "YYYY-MM-DD") : null}
                              onChange={(date) => field.onChange(date?.format("YYYY-MM-DD") || "")}
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
                              readOnly={!isEditing}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <Box>
                        <Controller
                          name="toDate"
                          control={control}
                          rules={{ required: t("movie_detail.required.end_day") }}
                          render={({ field, fieldState: { error } }) => (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={t("movie_detail.label.end_day")}
                                {...field}
                                value={field.value ? dayjs(field.value, "YYYY-MM-DD") : null}
                                onChange={(date) => field.onChange(date?.format("YYYY-MM-DD") || "")}
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
                                readOnly={!isEditing}
                              />
                            </LocalizationProvider>
                          )}
                        />
                      </Box>
                      <Controller
                        name="rating"
                        control={control}
                        rules={{ required: t("movie_detail.required.age_group") }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth margin="dense" variant="outlined" error={!!error}>
                            <InputLabel id="demo-simple-select-label">{t("movie_detail.input_label.age_class")}</InputLabel>
                            <Select
                              {...field}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              disabled={!isEditing} // Disable if not editing
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
                        rules={{ required: t("movie_detail.required.version") }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl fullWidth margin="dense" variant="outlined" error={!!error}>
                            <InputLabel id="demo-simple-select-label">{t("movie_detail.input_label.version")}</InputLabel>
                            <Select
                              {...field}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              disabled={!isEditing} // Disable if not editing
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
                            message: t("movie_detail.message.duration"),
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t("movie_detail.label.duration")}
                            type="number"
                            margin="dense"
                            variant="outlined"
                            value={field.value}
                            error={!!error}
                            helperText={error ? error.message : ""}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">{t("movie_detail.input_label.minute")}</InputAdornment>,
                              readOnly: !isEditing, // Make readonly if not editing
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="director"
                        control={control}
                        rules={{ required: t("movie_detail.required.director") }}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label={t("movie_detail.label.director")}
                            margin="dense"
                            variant="outlined"
                            error={!!error}
                            helperText={error ? error.message : ""}
                            InputProps={{
                              readOnly: !isEditing, // Make readonly if not editing
                            }}
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
                          required: {
                            value: true,
                            message: t("movie_detail.required.image"),
                          },
                        }}
                        render={({ field, fieldState: { error } }) => {
                          if (error) {
                            toast.error(error.message || "");
                          }
                          return (
                            <Box
                              component="section"
                              sx={{
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
                                {uploadedImage && isEditing && (
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
                              {isEditing && (
                                <CloudinaryUploadWidget
                                  uwConfig={uwConfig}
                                  setPublicId={(publicId) => {
                                    const imageUrl = `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
                                    setUploadedImage(imageUrl);
                                    field.onChange(imageUrl); // Update the field value
                                  }}
                                />
                              )}
                              {error && (
                                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                  {error.message}
                                </Typography>
                              )}
                            </Box>
                          );
                        }}
                      />
                    </Box>
                  </Stack>

                  <Controller
                    name="actors"
                    control={control}
                    rules={{ required: t("movie_detail.required.actor") }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t("movie_detail.label.actor")}
                        margin="dense"
                        variant="outlined"
                        sx={{ mt: 3 }} // Added margin-top
                        error={!!error}
                        helperText={error ? error.message : ""}
                        InputProps={{
                          readOnly: !isEditing, // Make readonly if not editing
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="trailer"
                    control={control}
                    rules={{ required: t("movie_detail.required.trailer") }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t("movie_detail.label.trailer")}
                        margin="dense"
                        variant="outlined"
                        error={!!error}
                        helperText={error ? error.message : ""}
                        InputProps={{
                          readOnly: !isEditing, // Make readonly if not editing
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="categoriesIds"
                    control={control}
                    rules={{
                      validate: (value) => value.length > 0 || t("movie_detail.required.category"),
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {t("movie_detail.label.category")}
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
                                  checked={field.value.includes(category.categoryId)}
                                  onChange={(e) => {
                                    const newValue = e.target.checked ? [...field.value, category.categoryId] : field.value.filter((id) => id !== category.categoryId);
                                    field.onChange(newValue);
                                  }}
                                  disabled={!isEditing} // Disable if not editing
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
                      required: t("movie_detail.required.content"),
                      validate: (value) => value.trim() !== "" || t("movie_detail.required.content"),
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        {" "}
                        {/* Added margin top */}
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          {" "}
                          {/* Added header */}
                          {t("movie_detail.label.content")}
                        </Typography>
                        <TextEdit
                          value={field.value}
                          onChange={(val: string) => field.onChange(val)}
                          error={error?.message}
                          readOnly={!isEditing} // Make readonly if not editing
                        />
                      </Box>
                    )}
                  />
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    {isEditing ? (
                      <Button type="submit" variant="contained">
                        {movie ? t("movie_detail.update") : t("movie_detail.add_new")}
                      </Button>
                    ) : null}
                  </Box>
                </form>
                {!isEditing ? (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <Button variant="contained" onClick={() => setIsEditing(true)}>
                      {t("movie_detail.edit")}
                    </Button>
                  </Box>
                ) : null}
              </Container>
            </Stack>
            <Button onClick={() => navigate("/admin/ql-phim")}>{t("movie_detail.back")}</Button>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
