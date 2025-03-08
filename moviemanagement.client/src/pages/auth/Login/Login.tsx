import { Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { login } from "../../../apis/mock.apis";
import { useAuth } from "../../../contexts/AuthContext";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authLogin } = useAuth();
  const { t } = useTranslation();

  const validationSchema = yup.object({
    username: yup
      .string()
      .required(t("auth.login.validation.username_required")),
    password: yup
      .string()
      .test(
        "is-valid-password",
        t("auth.login.validation.password_length"),
        (value, context) => {
          if (context.parent.username === "admin" && value === "admin") {
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

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const toastId = toast.loading("Đang đăng nhập...");

      try {
        const response = await login(values.username, values.password);
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
          setTimeout(() => {
            navigate("/admin/thong-ke");
          }, 1000);
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#121212",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "400px",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          {t("auth.login.title")}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label={t("auth.login.username")}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
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
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Link href="#" underline="hover" sx={{ fontSize: "0.875rem" }}>
              {t("auth.login.forgot_password")}
            </Link>
          </Box>

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            {loading
              ? t("auth.login.processing")
              : t("auth.login.login_button")}
          </Button>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("auth.login.no_account")}{" "}
              <Link href="/auth/signup" underline="hover">
                {t("auth.login.signup_link")}
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                navigate("/users/profile/1");
              }}
            >
              User Detail
            </Button>
          </Box>
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                navigate("/admin/thong-ke");
              }}
            >
              Quick Admin
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
