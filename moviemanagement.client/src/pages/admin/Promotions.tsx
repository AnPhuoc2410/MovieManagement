import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AppNavbar from "../../components/mui/AppNavbar";
import Header from "../../components/mui/Header";
import SideMenu from "../../components/mui/SideMenu";

import CloudinaryUploadWidget from "../../components/cloudinary/CloudinaryUploadWidget";

import dayjs from "dayjs";
import TextEdit from "../../components/admin/TextEdit";
import { ENV } from "../../env/env.config";
import AppTheme from "../../shared-theme/AppTheme";

interface Promotion {
  promotionId: string;
  promotionName: string;
  discount: number;
  fromDate: string;
  toDate: string;
  content: string;
  image?: string;
}

export default function Promotions({
  disableCustomTheme = false,
}: {
  disableCustomTheme?: boolean;
}) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null,
  );
  const [uploadedImage, setUploadedImage] = useState<string>("");

  useEffect(() => {
    async function fetchPromotions() {
      try {
        const response = await axios.get(
          "https://localhost:7119/api/Promotions/GetAll",
        );
        setPromotions(response.data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    }
    fetchPromotions();
  }, []);

  const { watch, control, handleSubmit, reset, setValue } = useForm<Promotion>({
    defaultValues: {
      promotionId: "",
      promotionName: "",
      discount: 0,
      fromDate: "",
      toDate: "",
      content: "",
      image: "",
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

  const handleOpen = (promotion?: Promotion) => {
    setSelectedPromotion(promotion || null);
    reset(
      promotion || {
        promotionId: "",
        promotionName: "",
        discount: 0,
        fromDate: "",
        toDate: "",
        content: "",
        image: "",
      },
    );
    setUploadedImage(promotion?.image || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPromotion(null);
    setUploadedImage("");
  };

  const onSubmit = async (data: Promotion) => {
    try {
      const payload = {
        ...data,
        promotionId: data.promotionId ? data.promotionId : null,
      };
      // Create new promotion
      const response = await axios.post(
        "https://localhost:7119/api/Promotions/CreateAsync",
        payload,
        { headers: { "Content-Type": "application/json" } },
      );
      setPromotions([...promotions, response.data]);

      handleClose();
    } catch (error) {
      console.error("Error posting promotion:", error);
    }
  };

  const handleDelete = async (promotionId: string) => {
    try {
      await axios.delete(
        `https://localhost:7119/api/Promotions/Delete/${promotionId}`,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      setPromotions(promotions.filter((p) => p.promotionId !== promotionId));
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const handleEdit = (promotion: Promotion) => {
    navigate(`/admin/khuyen-mai/${promotion.promotionId}`, {
      state: { promotion },
    });
  };

  const columns: GridColDef[] = [
    {
      field: "promotionId",
      headerName: "ID",
      width: 100,
      sortable: false,
      filterable: false,
    },
    { field: "promotionName", headerName: "Tiêu Đề", flex: 1 },
    { field: "discount", headerName: "Giảm giá (%)", width: 130 },
    {
      field: "fromDate",
      headerName: "Bắt đầu",
      width: 150,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD/MM/YYYY") : ""}
        </span>
      ),
    },
    {
      field: "toDate",
      headerName: "Kết thúc",
      width: 150,
      renderCell: (params) => (
        <span>
          {params.value ? dayjs(params.value).format("DD/MM/YYYY") : ""}
        </span>
      ),
    },
    { field: "content", headerName: "Chi Tiết", flex: 1 },
    {
      field: "image",
      headerName: "Ảnh",
      width: 120,
      renderCell: (params) =>
        params.row.image ? (
          <img
            src={params.row.image}
            alt="Promotion"
            style={{ width: "100%", height: "auto" }}
          />
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
          <IconButton onClick={() => handleDelete(params.row.promotionId)}>
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
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                sx={{ mb: 2 }}
              >
                Thêm Khuyến Mãi
              </Button>

              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={promotions}
                  columns={columns}
                  pageSizeOptions={[5, 10, 20]}
                  getRowId={(row) => row.promotionId}
                />
              </Box>
            </Stack>
          </Box>
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>
            {selectedPromotion ? "Sửa Khuyến Mãi" : "Tạo Khuyến Mãi"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="promotionName"
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
                name="fromDate"
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
                name="toDate"
                control={control}
                rules={{
                  required: "Nhập thời gian kết thúc",
                  validate: (value) => {
                    const start = watch("fromDate");
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
                name="content"
                control={control}
                defaultValue=""
                rules={{ required: "Nhập chi tiết" }}
                render={({ field, fieldState: { error } }) => (
                  <TextEdit
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={error?.message}
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
