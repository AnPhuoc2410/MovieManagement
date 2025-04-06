import {
  FileUploadOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import ManagementPageLayout from "../../../layouts/ManagementLayout";
import { AddEmployee } from "../../../types/users.type";
import toast from "react-hot-toast";
import api from "../../../apis/axios.config";
import { t } from "i18next";

// Phone number regex for Vietnam
const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
// CMND/CCCD regex (9-12 digits)
const idCardRegExp = /^[0-9]{9,12}$/;

const ThemNhanVienMoi: React.FC = () => {
  // Default avatar URL
  const defaultAvatarUrl =
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Katherine";

  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatarUrl);
  const [isCustomAvatar, setIsCustomAvatar] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik<AddEmployee>({
    initialValues: {
      avatar: null,
      userName: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      birthDate: "",
      gender: 0,
      email: "",
      idCard: "",
      phoneNumber: "",
      address: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .min(5, t("admin.employee_management.validation.min_username"))
        .max(20, t("admin.employee_management.validation.max_username"))
        .required(t("admin.employee_management.validation.required_username")),

      password: Yup.string()
        .min(8, t("admin.employee_management.validation.min_password"))
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          t("admin.employee_management.validation.match_password")
        )
        .required(t("admin.employee_management.validation.required_password")),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], t("admin.employee_management.validation.confirm_match"))
        .required(t("admin.employee_management.validation.confirm_required")),

      fullName: Yup.string()
        .required(t("admin.employee_management.validation.required_fullname")),

      birthDate: Yup.date()
        .max(new Date(), t("admin.employee_management.validation.birthdate_valid"))
        .required(t("admin.employee_management.validation.birthdate_required")),

      gender: Yup.number()
        .required(t("admin.employee_management.validation.gender_required")),

      email: Yup.string()
        .email(t("admin.employee_management.validation.email_invalid"))
        .required(t("admin.employee_management.validation.email_required")),

      idCard: Yup.string()
        .matches(idCardRegExp, t("admin.employee_management.validation.id_card_valid"))
        .required(t("admin.employee_management.validation.id_card_required")),

      phoneNumber: Yup.string()
        .matches(phoneRegExp, t("admin.employee_management.validation.phone_invalid"))
        .required(t("admin.employee_management.validation.phone_required")),

      address: Yup.string()
        .required(t("admin.employee_management.validation.address_required")),
    }),
    onSubmit: async (values) => {
      const { confirmPassword, ...restValues } = values;
      // Create a new object with the current avatar URL
      const submitData = {
        ...restValues,
        avatar: isCustomAvatar ? avatarUrl : null,
      };
      console.log("Form submitted with values:", submitData);
      try {
        const res = await api.post("/auth/register", submitData);
        console.log(`Response: ${JSON.stringify(res.data, null, 2)}`);
        if (res.status === 200) {
          toast.success(t("toast.success.employee.create"));
        } else {
          const data = res.data;
          throw new Error(data.reason || t("toast.error.employee.create"));
        }
      } catch (error) {
        console.log(`Error: ${error}`);
        toast.error(t("toast.error.employee.create"));
      }
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("avatar", file);

      // Create preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        setIsCustomAvatar(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ""; // Reset input value
  };

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url) {
      setAvatarUrl(url);
      setIsCustomAvatar(true);
    } else {
      setAvatarUrl(defaultAvatarUrl);
      setIsCustomAvatar(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setAvatarUrl(defaultAvatarUrl);
    setIsCustomAvatar(false);
  };

  // Update gender value handling
  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "Male" ? 0 : 1;
    formik.setFieldValue("gender", value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ManagementPageLayout>
      <Container maxWidth="lg">
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label={t("admin.employee_management.detail.image")}
              variant="standard"
              type="text"
              value={avatarUrl}
              onChange={handleAvatarUrlChange}
              InputProps={{
                endAdornment: (
                  <IconButton component="label">
                    <FileUploadOutlined />
                    <input
                      style={{ display: "none" }}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </IconButton>
                ),
              }}
            />
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <img
                src={avatarUrl}
                alt="Avatar preview"
                style={{
                  height: "100px",
                  width: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "1px solid #eee",
                }}
                onError={(e) => {
                  // If image fails to load, fall back to default
                  const target = e.target as HTMLImageElement;
                  target.src = defaultAvatarUrl;
                  setAvatarUrl(defaultAvatarUrl);
                  setIsCustomAvatar(false);
                }}
              />
            </Box>
          </Box>

          <TextField
            name="userName"
            label={t("admin.employee_management.detail.account")}
            variant="standard"
            fullWidth
            margin="normal"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
          />

          <TextField
            name="password"
            label={t("admin.employee_management.detail.password")}
            variant="standard"
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(230, 195, 0, 0.1)",
                      },
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: "#666" }} />
                    ) : (
                      <Visibility sx={{ color: "#666" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            name="confirmPassword"
            label={t("admin.employee_managemet.detail.password_confirm")}
            variant="standard"
            fullWidth
            margin="normal"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />

          <TextField
            name="fullName"
            label={t("admin.employee_managemet.detail.fullname")}
            variant="standard"
            fullWidth
            margin="normal"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />

          <TextField
            name="birthDate"
            label={t("admin.employee_managemet.detail.birthday")}
            variant="standard"
            fullWidth
            margin="normal"
            type="date"
            value={formik.values.birthDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
            helperText={formik.touched.birthDate && formik.errors.birthDate}
            InputLabelProps={{
              shrink: true,
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
            <Typography>{t("admin.employee_managemet.detail.gender")}</Typography>
            <RadioGroup
              name="gender"
              value={formik.values.gender === 0 ? "Male" : "Female"}
              onChange={handleGenderChange}
              sx={{ display: "flex", gap: 10, flexDirection: "row" }}
            >
              <FormControlLabel value="Male" control={<Radio />} label="Nam" />
              <FormControlLabel value="Female" control={<Radio />} label="Nữ" />
            </RadioGroup>
            {formik.touched.gender && formik.errors.gender && (
              <FormHelperText error>{formik.errors.gender}</FormHelperText>
            )}
          </Box>

          <TextField
            name="email"
            label="Email"
            variant="standard"
            fullWidth
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            name="idCard"
            label={t("admin.employee_managemet.detail.id_card")}
            variant="standard"
            fullWidth
            margin="normal"
            value={formik.values.idCard}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.idCard && Boolean(formik.errors.idCard)}
            helperText={formik.touched.idCard && formik.errors.idCard}
          />

          <TextField
            name="phoneNumber"
            label={t("admin.employee_managemet.detail.phone")}
            variant="standard"
            fullWidth
            margin="normal"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          <TextField
            name="address"
            label={t("admin.employee_managemet.detail.address")}
            variant="standard"
            fullWidth
            margin="normal"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
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
              onClick={handleCancel}
              color="error"
              variant="contained"
              type="button"
            >
              {t("admin.employee_management.cancel")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {t("admin.employee_management.save")}
            </Button>
          </Box>
        </Box>
      </Container>
    </ManagementPageLayout>
  );
};

export default ThemNhanVienMoi;
