import { Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { useAuth } from "../../../contexts/AuthContext";
import { login } from "../../../apis/mock.apis";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { authLogin } = useAuth();
  const { t } = useTranslation();

  const validationSchema = yup.object({
    email: yup.string().required(t("auth.login.validation.email_required")),
    password: yup
      .string()
      .test(
        "is-valid-password",
        t("auth.login.validation.password_length"),
        (value, context) => {
          if (context.parent.email === "admin" && value === "admin") {
            return true;
          }
          return value !== undefined && value.length >= 8;
        },
      )
      .required(t("auth.login.validation.password_required")),
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const toastId = toast.loading("Đang đăng nhập...");

      try {
        const response = await login({
          email: values.email,
          password: values.password,
        });
        toast.dismiss(toastId);

        if (response.is_success) {
          // Extract token data from the nested structure
          const tokenData = response.data.token;

          authLogin({
            access_token: tokenData.access_token,
            token_type: tokenData.token_type,
            expires: tokenData.expires,
            is_mobile: tokenData.is_mobile,
          });

          toast.success("Đăng nhập thành công! Đang chuyển hướng...");

          console.log("value email", values.email);

          switch (values.email) {
            case "admin":
              setTimeout(() => {
                navigate("/admin/thong-ke");
              }, 1000);
              break;
            case "hoangdz1604@gmail.com":
              setTimeout(() => {
                navigate("/admin/thong-ke");
              }, 1000);
              break;
            case "m@gmail.com":
              setTimeout(() => {
                navigate("/users/profile/09ace9f8-a25a-4c92-80a1-17c08ebef2e1");
              }, 1000);
              break;
            case "e@gmail.com":
              setTimeout(() => {
                navigate("/users/profile/596cb162-4c3f-47e7-91e4-491761d03454");
              }, 1000);
              break;
            case "a@gmail.com":
              setTimeout(() => {
                navigate("/users/profile/d3ddb1f7-22fa-42b3-bbe8-71dc29688ef2");
              }, 1000);
              break;
          }
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("An unexpected error occurred.");
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const textFieldStyle = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      height: "50px", // Consistent height
      "&.Mui-focused fieldset": {
        borderColor: "#e6c300",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#666",
      fontSize: "0.95rem",
      transform: "translate(14px, 16px) scale(1)",
      "&.Mui-focused": {
        color: "#000",
        transform: "translate(14px, -9px) scale(0.75)",
      },
      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
      },
    },
    "& .MuiInputBase-input": {
      padding: "14px",
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "3px",
      marginTop: "3px",
    },
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{ mb: 1, fontWeight: 600, color: "#1a1a1a" }}
        >
          {t("auth.login.welcome")}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {t("auth.login.subtitle")}
        </Typography>
      </Box>

      <TextField
        fullWidth
        id="email"
        name="email"
        label={t("auth.login.email")}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        sx={textFieldStyle}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: 1 }}>
              <Person sx={{ color: "#666" }} />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        id="password"
        name="password"
        label={t("auth.login.password")}
        type={showPassword ? "text" : "password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        sx={textFieldStyle}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ ml: 1 }}>
              <Lock sx={{ color: "#666" }} />
            </InputAdornment>
          ),
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={handleRememberMe}
              sx={{
                color: "#666",
                "&.Mui-checked": {
                  color: "#e6c300",
                },
                "&:hover": {
                  backgroundColor: "rgba(230, 195, 0, 0.1)",
                },
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: "0.875rem",
              }}
            >
              {t("auth.login.remember_me")}
            </Typography>
          }
        />

        <Link
          href="#"
          underline="hover"
          sx={{
            fontSize: "0.875rem",
            color: "black",
            transition: "color 0.2s",
            "&:hover": {
              color: "#e6c300",
            },
          }}
        >
          {t("auth.login.forgot_password")}
        </Link>
      </Box>

      <Button
        variant="contained"
        fullWidth
        type="submit"
        disabled={loading}
        sx={{
          backgroundColor: "#e6c300",
          color: "black",
          py: 1.5,
          height: "48px",
          borderRadius: 1.5,
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
          boxShadow: 2,
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: "#e6c300",
            boxShadow: 4,
          },
          "&:disabled": {
            backgroundColor: "#fafafa",
            color: "#bdbdbd",
          },
        }}
      >
        {loading ? t("auth.login.processing") : t("auth.login.login_button")}
      </Button>
    </form>
  );
};
