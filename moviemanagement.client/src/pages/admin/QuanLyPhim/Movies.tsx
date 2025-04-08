import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CssBaseline,
  IconButton,
  Stack
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Popconfirm } from 'antd';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AppNavbar from "../../../components/mui/AppNavbar";
import Header from "../../../components/mui/Header";
import SideMenu from "../../../components/mui/SideMenu";


import dayjs from "dayjs";
import toast from "react-hot-toast";
import api from "../../../apis/axios.config";
import { ENV } from "../../../env/env.config";
import AppTheme from "../../../shared-theme/AppTheme";
import { useTranslation } from "react-i18next";

interface Movie {
  movieId: string;
  movieName: string;
  image?: string;
  fromDate: string;
  director: string;
  duration: number;
  version: string;
}

export default function Movies({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await api.get("movie");
        setMovies(response.data.data);
        console.log("Movies:", response.data.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, [t]);

  const { watch, control, handleSubmit, reset, setValue } = useForm<Movie>({
    defaultValues: {
      movieId: "",
      movieName: "",
      image: "",
      fromDate: "",
      director: "",
      duration: 0,
      version: "",
    },
  });
  const navigate = useNavigate();

  const uwConfig = {
    cloudName: ENV.CLOUDINARY_CLOUD_NAME,
    uploadPreset: "movie_up",
  };

  const handleSetPublicId = (publicId: string) => {
    const imageUrl = `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    setUploadedImage(imageUrl);
    setValue("image", imageUrl);
  };

  const handleAddMovie = (movie?: Movie) => {
    navigate(`/admin/ql-phim/them-phim`, {
      state: { movieId: movie?.movieId || null },
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMovie(null);
    setUploadedImage("");
  };

  const onSubmit = async (data: Movie) => {
    try {
      const payload = {
        ...data,
        movieId: data.movieId || null,
        image:
          data.image?.trim() ||
          "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1741245144/p9qsbq4xr82adzxsushl.png",
      };

      // Create new movie
      const response = await api.post(
        "movies",
        payload,
        { headers: { "Content-Type": "application/json" } },
      );

      setMovies([...movies, response.data]);
      handleClose();
      toast.success(t("toast.success.movie.create"));
    } catch (error) {
      toast.error(`${t("toast.error.movie.add")} ${error}`);
    }
  };

  const handleDelete = async (movieId: string) => {
    try {
      await api.delete(`movie/${movieId}`);
      setMovies(movies.filter((m) => m.movieId !== movieId));
      toast.success(t("toast.success.movie.delete"));
    } catch (error) {
      toast.error(`${t("toast.error.movie.delete")} ${error}`);
    }
  };

  const handleEdit = (movie: Movie) => {
    navigate(`/admin/ql-phim/${movie.movieId}`, {
      state: { movie },
    });
  };

  const columns: GridColDef[] = [
    {
      field: "image",
      renderHeader: () => <strong>{t("admin.movie_management.detail.image")}</strong>,
      width: 120,
      renderCell: (params) =>
        params.row.image ? (
          <img
            src={params.row.image}
            alt="Movie"
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          "No image"
        ),
    },
    {
      field: "movieName",
      renderHeader: () => <strong>{t("admin.movie_management.detail.name")}</strong>,
      flex: 1,
    },
    {
      field: "postDate",
      renderHeader: () => <strong>{t("admin.movie_management.detail.postdate")}</strong>,
      width: 130,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD/MM/YYYY") : ""}
        </span>
      ),
    },
    {
      field: "fromDate",
      renderHeader: () => <strong>{t("admin.movie_management.detail.showtime")}</strong>,
      width: 130,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD/MM/YYYY") : ""}
        </span>
      ),
    },
    {
      field: "toDate",
      renderHeader: () => <strong>{t("admin.movie_management.detail.end_day")}</strong>,
      width: 130,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD/MM/YYYY") : ""}
        </span>
      ),
    },
    {
      field: "director",
      renderHeader: () => <strong>{t("admin.movie_management.detail.director")}</strong>,
      flex: 0.5,
    },
    {
      field: "version",
      renderHeader: () => <strong>{t("admin.movie_management.detail.version")}</strong>,
      width: 100,
      align: "center", // Center-align the content
      headerAlign: "center", // Center-align the header
    },
    {
      field: "actions",
      renderHeader: () => <strong>{t("admin.movie_management.detail.function")}</strong>,
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon color="primary" />
          </IconButton>
          <Popconfirm
            placement="topRight"
            title={t("admin.movie_management.confirm")}
            description={t("admin.movie_management.confirm_delete")}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(params.row.movieId)}
          >
            <IconButton>
              <DeleteIcon color="error" />
            </IconButton>
          </Popconfirm>

        </>
      ),
    },
  ];

  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <SideMenu />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Top Navigation Bar */}
          <AppNavbar />

          {/* Page Content */}
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
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAddMovie()}
                sx={{ mb: 2 }}
              >
                {t("admin.movie_management.add")}
              </Button>

              <Box sx={{ height: "calc(100vh - 170px)", width: "100%" }}>
                <DataGrid
                  rows={movies}
                  columns={columns}
                  pagination
                  pageSizeOptions={[3, 5, 10]} // Available page size options
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 3 }, // Set default page size to 3
                    },
                  }}
                  getRowId={(row) => row.movieId}
                  rowHeight={120} // Match the image height
                />
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>{selectedMovie ? "Sửa Phim" : "Tạo Phim"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="movieName"
                control={control}
                rules={{ required: "Tên phim yêu cầu" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tên Phim"
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
              <Controller
                name="fromDate"
                control={control}
                rules={{ required: "Nhập ngày chiếu" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ngày Chiếu"
                    type="date"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />

                )}
              />
              <Controller
                name="director"
                control={control}
                rules={{ required: "Nhập đạo diễn" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Đạo Diễn"
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
              <Controller
                name="duration"
                control={control}
                rules={{
                  required: "Nhập thời lượng",
                  min: { value: 1, message: "Thời lượng ít nhất 1 phút" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Thời Lượng (phút)"
                    type="number"
                    margin="dense"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
              <Controller
                name="version"
                control={control}
                rules={{
                  required: "Nhập phiên bản",
                  validate: (value) =>
                    [2, 3].includes(value) ||
                    "Phiên bản chỉ có thể là 2D hoặc 3D",
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phiên Bản (2D/3D)"
                    type="number"
                    margin="dense"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
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
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Hủy
                </Button>
                <Button type="submit" variant="contained">
                  {selectedMovie ? "Cập nhật" : "Tạo"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog> */}
      </Box>
    </AppTheme>
  );
}
