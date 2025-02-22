import * as React from "react";
import { useState } from "react";
import { Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

// Layout Components
import AppNavbar from "../../components/mui/AppNavbar";
import Header from "../../components/mui/Header";
import SideMenu from "../../components/mui/SideMenu";

// Import your Cloudinary Upload Widget component
import CloudinaryUploadWidget from "../../components/cloudinary/CloudinaryUploadWidget";

// Theme & Customizations
import AppTheme from "../../shared-theme/AppTheme";
import TextEdit from "../../components/admin/TextEdit";

interface Promotion {
  id: number;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
  detail: string;
  image?: string;
}

const initialPromotions: Promotion[] = [
  {
    id: 1,
    title: "Black Friday",
    discount: 30,
    startDate: "2025-11-25",
    endDate: "2025-11-30",
    detail: "Discount 30% for all products",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1740121129/samples/chair.png", // example placeholder
  },
  {
    id: 2,
    title: "New Year Sale",
    discount: 20,
    startDate: "2025-12-31",
    endDate: "2026-01-05",
    detail: "Discount 20% for all products",
    image: "https://res.cloudinary.com/dwqyqsqmq/image/upload/v1740121129/samples/coffee.jpg",
  },
];

export default function Promotions({ disableCustomTheme = false }: { disableCustomTheme?: boolean }) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  // For image preview from Cloudinary
  const [uploadedImage, setUploadedImage] = useState<string>("");

  const { watch, control, handleSubmit, reset, setValue } = useForm<Promotion>({
    defaultValues: { id: 0, title: "", discount: 0, startDate: "", endDate: "", detail: "", image: "" },
  });

  // Cloudinary widget configuration
  const uwConfig = {
    cloudName: "dwqyqsqmq",
    uploadPreset: "movie_up",
  };

  const handleSetPublicId = (publicId: string) => {
    const imageUrl = `https://res.cloudinary.com/dwqyqsqmq/image/upload/${publicId}`;
    setUploadedImage(imageUrl);
    setValue("image", imageUrl);
  };

  const handleOpen = (promotion?: Promotion) => {
    setSelectedPromotion(promotion || null);
    reset(promotion || { id: 0, title: "", discount: 0, startDate: "", endDate: "", detail: "", image: "" });
    setUploadedImage(promotion?.image || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPromotion(null);
    setUploadedImage("");
  };

  const onSubmit = (data: Promotion) => {
    if (selectedPromotion) {
      setPromotions(promotions.map((p) => (p.id === data.id ? data : p)));
    } else {
      setPromotions([...promotions, { ...data, id: promotions.length + 1 }]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    setPromotions(promotions.filter((p) => p.id !== id));
  };

  const navigate = useNavigate();
  const handleEdit = (promotion: Promotion) => {
    navigate(`/admin/khuyen-mai/${promotion.id}`, { state: { promotion } });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Tiêu Đề", flex: 1 },
    { field: "discount", headerName: "Giảm giá (%)", width: 130 },
    { field: "startDate", headerName: "Thời gian bắt đầu", width: 150 },
    { field: "endDate", headerName: "Thời gian kết thúc", width: 150 },
    { field: "detail", headerName: "Chi Tiết", flex: 1 },
    {
      field: "image",
      headerName: "Ảnh",
      width: 120,
      renderCell: (params) =>
        params.row.image ? (
          <img src={params.row.image} alt="Promotion" style={{ width: "100%", height: "auto" }} />
        ) : (
          "No image"
        ),
    },
    {
      field: "actions",
      headerName: "Chức năng",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
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
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
                Thêm Khuyến Mãi
              </Button>

              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid rows={promotions} columns={columns} pageSizeOptions={[5, 10, 20]} />
              </Box>
            </Stack>
          </Box>
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>{selectedPromotion ? "Sửa Khuyến Mãi" : "Tạo Khuyến Mãi"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Tiêu đề yêu cầu" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Tiêu đề"
                    margin="dense"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
              <Controller
                name="discount"
                control={control}
                rules={{
                  required: "Nhập giảm giá",
                  min: { value: 1, message: "Giảm giá ít nhất 1%" },
                  max: { value: 100, message: "Giảm giá không vượt quá 100%" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Giảm giá (%)"
                    type="number"
                    margin="dense"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Nhập thời gian bắt đầu" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Bắt đầu"
                    type="date"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: "Nhập thời gian kết thúc",
                  validate: (value) => {
                    const start = watch("startDate");
                    if (new Date(value) < new Date(start)) {
                      return "Thời gian kết thúc phải sau thời gian bắt đầu";
                    }
                    return true;
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Kết thúc"
                    type="date"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
              <Controller
                  name="detail"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Nhập chi tiết" }}
                  render={({ field }) => (
                    <TextEdit
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />

              <Box sx={{ my: 2 }}>
                <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={handleSetPublicId} />
                {uploadedImage && (
                  <Box sx={{ mt: 1 }}>
                    <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "100%", maxHeight: 150 }} />
                  </Box>
                )}
              </Box>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Hủy
                </Button>
                <Button type="submit" variant="contained">
                  {selectedPromotion ? "Cập nhật" : "Tạo"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </AppTheme>
  );
}
