import React, { useEffect, useState } from "react";
import { Box, Button, CssBaseline, TextField, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

// Layout Components
import AppNavbar from "../../components/mui/AppNavbar";
import SideMenu from "../../components/mui/SideMenu";
import TextEdit from "../../components/admin/TextEdit";

// Import Cloudinary Upload Widget component
import CloudinaryUploadWidget from "../../components/cloudinary/CloudinaryUploadWidget";

// Theme & Customizations
import AppTheme from "../../shared-theme/AppTheme";

interface Promotion {
  id: number;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
  detail: string;
  image?: string;
}

export default function PromotionDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  // Expect the promotion details to be passed via location state.
  const promotion: Promotion | undefined = location.state?.promotion;

  // If promotion is not passed, you might redirect or show an error.
  useEffect(() => {
    if (!promotion) {
      navigate("/admin/khuyen-mai");
    }
  }, [promotion, navigate]);

  const { watch, control, handleSubmit, reset, setValue } = useForm<Promotion>({
    defaultValues: promotion || {
      id: 0,
      title: "",
      discount: 0,
      startDate: "",
      endDate: "",
      detail: "",
      image: "",
    },
  });

  // Update the form if promotion changes.
  useEffect(() => {
    if (promotion) {
      reset(promotion);
    }
  }, [promotion, reset]);

  // Cloudinary widget configuration
  const uwConfig = {
    cloudName: "dwqyqsqmq",
    uploadPreset: "movie_up",
  };

  const [uploadedImage, setUploadedImage] = useState<string>(promotion?.image || "");

  const handleSetPublicId = (publicId: string) => {
    const imageUrl = `https://res.cloudinary.com/dwqyqsqmq/image/upload/${publicId}`;
    setUploadedImage(imageUrl);
    setValue("image", imageUrl);
  };

  const onSubmit = async (data: Promotion) => {
    // try {
    //   const response = await fetch(`https://your-api.com/promotions/${data.id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //   });
    //   if (!response.ok) {
    //     throw new Error("Update failed");
    //   }
    console.log("Promotion updated:", data);
    navigate("/admin/khuyen-mai");
    // } catch (error) {
    //   console.error("Error updating promotion:", error);
    // }
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
              <h1>{promotion ? "Cập Nhật Khuyến Mãi" : "Tạo Khuyến Mãi"}</h1>
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

                {/* Cloudinary Upload Section */}
                <Box sx={{ my: 2 }}>
                  <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={handleSetPublicId} />
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
                  Cập Nhật Khuyến Mãi
                </Button>
              </form>
            </Stack>
            <Button onClick={() => navigate("/admin/khuyen-mai")}>Trở lại</Button>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
