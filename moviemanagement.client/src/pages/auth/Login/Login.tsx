import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Link,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        navigate("/admin/thong-ke");
      }, 1000);
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
          Login
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
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
            label="Password"
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
              Forgot password?
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
              Do not have account?{" "}
              <Link href="/auth/signup" underline="hover">
                Sign up here
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
