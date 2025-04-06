import { Box, Button, CssBaseline, Stack, TextField } from "@mui/material";
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
import { Promotion } from "../../../types/promotion.types";
import api from "../../../apis/axios.config";
import { t } from "i18next";

export default function PromotionDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const promotion: Promotion | undefined = location.state?.promotion;

  useEffect(() => {
    if (!promotion) {
      navigate("/admin/khuyen-mai");
    }
  }, [promotion, navigate]);

  const { watch, control, handleSubmit, reset, setValue } = useForm<Promotion>({
    defaultValues: {
      promotionId: "",
      promotionName: "",
      discount: 0,
      fromDate: new Date(),
      toDate: new Date(),
      content: "",
      image: "",
    },
  });

  useEffect(() => {
    if (promotion) {
      reset(promotion);
    }
  }, [promotion, reset]);

  const uwConfig = {
    cloudName: ENV.CLOUDINARY_CLOUD_NAME,
    uploadPreset: "movie_up",
  };

  const [uploadedImage, setUploadedImage] = useState<string>(
    promotion?.image || "",
  );

  const handleSetPublicId = (publicId: string) => {
    const imageUrl = `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    setUploadedImage(imageUrl);
    setValue("image", imageUrl);
  };

  const onSubmit = async (data: Promotion) => {
    try {
      const payload = {
        ...data,
        promotionId: data.promotionId ? data.promotionId : null,
        fromDate: dayjs(data.fromDate).toISOString(),
        toDate: dayjs(data.toDate).toISOString(),
      };

      await api.put(
        `promotions/${data.promotionId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      toast.success(t("toast.success.promotion.update"), { removeDelay: 3000 });
      setTimeout(() => {
        navigate("/admin/khuyen-mai");
      }, 3000);
    } catch (error) {
      toast.error(`${t("toast.error.promotion.update")} ${error}`);
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
              <h1>{promotion ? t("admin.promotion_management.update") : t("admin.promotion_management.create")}</h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="promotionName"
                  control={control}
                  rules={{ required: t("admin.promotion_management.required.title") }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("admin.promotion_management.label.title")}
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
                    required: t("admin.promotion_management.required.discount"),
                    min: { value: 1, message: t("admin.promotion_management.message.min_promote") },
                    max: {
                      value: 100,
                      message: t("admin.promotion_management.message.max_promote"),
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("admin.promotion_management.label.discount")}
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
                  rules={{ required: t("admin.promotion_management.required.start_time") }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("admin.promotion_management.label.start_time")}
                      type="date"
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      value={
                        field.value
                          ? dayjs(field.value).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />

                <Controller
                  name="toDate"
                  control={control}
                  rules={{
                    required: t("admin.promotion_management.required.end_time"),
                    validate: (value) => {
                      const start = watch("fromDate");
                      if (new Date(value) < new Date(start)) {
                        return t("admin.promotion_management.validate.showtime");
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("admin.promotion_management.label.end_time")}
                      type="date"
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                      error={!!error}
                      helperText={error ? error.message : ""}
                      value={
                        field.value
                          ? dayjs(field.value).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                <Controller
                  name="content"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: t("admin.promotion_management.required.content"),
                    validate: (value) => {
                      const strippedValue = value
                        .replace(/<p><br><\/p>/g, "")
                        .trim();
                      return (
                        strippedValue !== "" || t("admin.promotion_management.validate.content")
                      );
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextEdit
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      error={error?.message}
                    />
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
                  {t("admin.promotion_management.update")}
                </Button>
              </form>
            </Stack>
            <Button onClick={() => navigate("/admin/khuyen-mai")}>
              {t("admin.promotion_management.back")}
            </Button>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
