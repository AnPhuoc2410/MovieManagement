import React, { useEffect, useState } from "react";
import { Box, Button, CssBaseline, TextField, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

// Layout Components
import AppNavbar from "../../components/mui/AppNavbar";
import SideMenu from "../../components/mui/SideMenu";

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
      navigate("/promotions");
    }
  }, [promotion, navigate]);

  const { control, handleSubmit, reset, setValue } = useForm<Promotion>({
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

  const onSubmit = (data: Promotion) => {
    // Update the promotion details (e.g., call an API or update global state).
    console.log("Updated Promotion:", data);
    // Navigate back to the promotions list or detail view after updating.
    navigate("/promotions");
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
              <Button onClick={() => navigate("/promotions")}>Back</Button>
              <h2>{promotion ? "Edit Promotion" : "Add Promotion"}</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="Title" margin="dense" />
                  )}
                />
                <Controller
                  name="discount"
                  control={control}
                  rules={{ required: "Discount is required", min: 1, max: 100 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Discount (%)"
                      type="number"
                      margin="dense"
                    />
                  )}
                />
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Start Date"
                      type="date"
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="End Date"
                      type="date"
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
                <Controller
                  name="detail"
                  control={control}
                  rules={{ required: "Detail is required" }}
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="Detail" margin="dense" />
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
                  Update Promotion
                </Button>
              </form>
            </Stack>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
