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
import { useNavigate } from "react-router";
import * as yup from "yup";
import { login } from "../../../apis/mock.apis";
import { useAuth } from "../../../contexts/AuthContext";

const validationSchema = yup.object({
  username: yup.string().required("Tài khoản không được để trống"),
  password: yup
    .string()
    .test(
      "is-valid-password",
      "Mật khẩu phải có ít nhất 8 ký tự",
      (value, context) => {
        // Bypass validation for admin/admin in development
        if (context.parent.username === "admin" && value === "admin") {
          return true;
        }
        // Apply normal validation rules
        return value !== undefined && value.length >= 8;
      },
    )
    .required("Mật khẩu không được để trống"),
});

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authLogin } = useAuth();

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
          maxWidth: 400,
          mx: "auto",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Đăng nhập
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Tài khoản"
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
            label="Mật khẩu"
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
              Quên mật khẩu?
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
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tài khoản?{" "}
              <Link href="/auth/signup" underline="hover">
                Đăng ký ngay
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
