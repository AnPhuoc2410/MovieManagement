import { FileUploadOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import Loader from "../../../components/shared/Loading";

import { fetchUserDetail, updateUserPartial } from "../../../apis/user.apis";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import toast from "react-hot-toast";
import { t } from "i18next";

const ChinhSuaThanhVien: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: memberData = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["memberDetail", id],
    queryFn: async () => {
      const response = await fetchUserDetail(id as string);
      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to fetch member data");
      }
      return response.data;
    },
  });

  // Track both the original URL and a preview URL (for newly uploaded files)
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set the initial image URL when component mounts or memberData changes
  useEffect(() => {
    if (memberData && memberData.avatar) {
      setImageUrl(memberData.avatar);
    }
  }, [memberData]);

  useEffect(() => {
    if (imageUrl) {
      console.log("Image URL updated:", imageUrl);
    }
  }, [imageUrl]);

  if (!memberData) return null;

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;
  if (!memberData) return <div>No employee data found</div>;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);

      // Create a URL for the image preview
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      setImageFile(file);
    }
    e.target.value = "";
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value); // Update the image URL as the user types
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = async () => {
    // Here you would typically save the form data
    // If imageFile exists, you'd upload it to your server
    // Otherwise, you'd use the existing imageUrl

    if (!id) return;

    try {
      await updateUserPartial(id, {
        fullName: memberData.fullName,
        birthDate: memberData.birthDate,
        avatar: memberData.avatar,
        gender: memberData.gender,
        email: memberData.email,
        phoneNumber: memberData.phoneNumber,
        address: memberData.address,
      });

      console.log("Image to save:", imageFile || imageUrl);
      toast.success("Cập nhật thông tin thành công");
    } catch {
      toast.error("Cập nhật thông tin thất bại");
    }
  };

  return (
    <ManagementPageLayout>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            {t("admin.member_management.title")}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label={t("admin.member_management.image")}
              variant="standard"
              value={imageUrl || ""}
              onChange={handleUrlChange}
              InputProps={{
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
                    maxHeight: "200px",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    mt: 1,
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={handleRemoveImage}
                  sx={{ mt: 1 }}
                >
                  {t("admin.member_management.remove_image")}
                </Button>
              </Box>
            )}
          </Box>

          <TextField
            label={t("admin.employee_management.detail.account")}
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={memberData.userName}
          />
          <TextField
            label={t("admin.employee_management.detail.fullname")}
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={memberData.fullName}
          />
          <TextField
            label={t("admin.employee_management.detail.birthday")}
            variant="standard"
            fullWidth
            margin="normal"
            type="date"
            defaultValue={memberData.birthDate}
            InputLabelProps={{
              style: { top: "-1.5rem" },
            }}
          />
          <Box
            sx={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
              justifyContent: "flex-start",
              my: 2,
            }}
          >
            <Typography>{t("admin.employee_management.detail.gender")}</Typography>
            <RadioGroup
              defaultValue={memberData.gender || "Male"}
              sx={{ display: "flex", gap: 10, flexDirection: "row" }}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Nam" />
              <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
            </RadioGroup>
          </Box>
          <TextField
            label={t("admin.employee_management.detail.email")}
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={memberData.email}
          />
          <TextField
            label={t("admin.employee_management.detail.id_card")}
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={memberData.idCard}
          />
          <TextField
            label={t("admin.employee_management.detail.phone")}
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={memberData.phoneNumber}
          />
          <TextField
            label={t("admin.employee_management.detail.address")}
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={memberData.address}
          />

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              onClick={() => {
                navigate(-1);
              }}
              color="error"
              variant="contained"
            >
              {t("admin.employee_management.come_back")}
            </Button>
            <Button
              onClick={handleSaveChanges}
              color="primary"
              variant="contained"
            >
              {t("admin.employee_management.save")}
            </Button>
          </Box>
        </Box>
      </Container>
    </ManagementPageLayout>
  );
};

export default ChinhSuaThanhVien;
