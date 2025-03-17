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
import { fetchUserDetail } from "../../../apis/user.apis";
import Loader from "../../../components/shared/Loading";
import ManagementPageLayout from "../../../layouts/ManagementLayout";

// Components
const ChinhSuaNhanVien: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: employeeData = null,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employeeDetail", id],
    queryFn: async () => {
      const response = await fetchUserDetail(id as string);
      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to fetch employee data");
      }
      return response.data;
    },
  });

  // Track both the original URL and a preview URL (for newly uploaded files)
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set the initial image URL when component mounts or employeeData changes
  useEffect(() => {
    if (employeeData && employeeData.avatar) {
      setImageUrl(employeeData.avatar);
    }
  }, [employeeData]);

  if (isLoading) return <Loader />;
  if (error) return <div>Failed to fetch data</div>;
  if (!employeeData) return <div>No employee data found</div>;

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

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = () => {
    // Here you would typically save the form data
    // If imageFile exists, you'd upload it to your server
    // Otherwise, you'd use the existing imageUrl

    console.log("Image to save:", imageFile || imageUrl);
    // After saving, you might want to navigate back
    // navigate(-1);
  };

  return (
    <ManagementPageLayout>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Chỉnh sửa thông tin nhân viên
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Hình ảnh"
              variant="standard"
              value={imageUrl || ""}
              InputProps={{
                readOnly: true,
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
                  Xóa hình
                </Button>
              </Box>
            )}
          </Box>

          <TextField
            label="Tài khoản"
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={employeeData.userName}
          />
          <TextField
            label="Họ tên"
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={employeeData.fullName}
          />
          <TextField
            label="Ngày sinh"
            variant="standard"
            fullWidth
            margin="normal"
            type="date"
            defaultValue={employeeData.birthDate}
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
            <Typography>Giới tính</Typography>
            <RadioGroup
              defaultValue={employeeData.gender || "Male"}
              sx={{ display: "flex", gap: 10, flexDirection: "row" }}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Nam" />
              <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
            </RadioGroup>
          </Box>
          <TextField
            label="Email"
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={employeeData.email}
          />
          <TextField
            label="Số CMND"
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={employeeData.idCard}
          />
          <TextField
            label="Số điện thoại"
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={employeeData.phoneNumber}
          />
          <TextField
            label="Địa chỉ"
            variant="standard"
            fullWidth
            margin="normal"
            defaultValue={employeeData.address}
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
              Quay lại
            </Button>
            <Button
              onClick={handleSaveChanges}
              color="primary"
              variant="contained"
            >
              Lưu thay đổi
            </Button>
          </Box>
        </Box>
      </Container>
    </ManagementPageLayout>
  );
};

export default ChinhSuaNhanVien;
