import {
  Assignment,
  Badge,
  Cake,
  Email,
  Home,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  fullname: yup.string().required("Full name is required"),
  dob: yup.date().required("Birth date is required"),
  gender: yup.string().required("Gender is required"),
  cmnd: yup.string().required("CMND is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  address: yup.string().required("Address is required"),
  phone: yup.string().required("Phone number is required"),
});

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    "Chi tiết tài khoản",
    "Thông tin cá nhân",
    "Thông tin liên hệ",
  ];

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      fullname: "",
      dob: "",
      gender: "",
      cmnd: "",
      email: "",
      address: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        alert(JSON.stringify(values, null, 2));
      }, 1000);
    },
  });

  const isStepOneComplete = () => {
    const hasErrors = Boolean(formik.errors.username || formik.errors.password);
    const isTouched = formik.touched.username || formik.touched.password;
    const hasValues = Boolean(formik.values.username && formik.values.password);
    return hasValues && (!isTouched || !hasErrors);
  };

  const isStepTwoComplete = () => {
    const hasErrors = Boolean(
      formik.errors.fullname ||
        formik.errors.dob ||
        formik.errors.gender ||
        formik.errors.cmnd,
    );
    const isTouched =
      formik.touched.fullname ||
      formik.touched.dob ||
      formik.touched.gender ||
      formik.touched.cmnd;
    const hasValues = Boolean(
      formik.values.fullname &&
        formik.values.dob &&
        formik.values.gender &&
        formik.values.cmnd,
    );
    return hasValues && (!isTouched || !hasErrors);
  };

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
        sx={{ p: 4, maxWidth: 600, mx: "auto", borderRadius: 2 }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 4, fontWeight: 600 }}
        >
          Đăng ký tài khoản
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          {activeStep === 0 && (
            <Box>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Tài khoản"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
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
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <TextField
                fullWidth
                id="fullname"
                name="fullname"
                label="Họ Tên"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.fullname && Boolean(formik.errors.fullname)
                }
                helperText={formik.touched.fullname && formik.errors.fullname}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                id="dob"
                name="dob"
                label="Ngày Sinh"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
                helperText={formik.touched.dob && formik.errors.dob}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cake color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
                <FormLabel component="legend">Giới Tính</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  row
                >
                  <FormControlLabel
                    value="Nam"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                </RadioGroup>
                {formik.touched.gender && formik.errors.gender && (
                  <Typography color="error" variant="caption">
                    {formik.errors.gender}
                  </Typography>
                )}
              </FormControl>
              <TextField
                fullWidth
                id="cmnd"
                name="cmnd"
                label="CMND"
                value={formik.values.cmnd}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cmnd && Boolean(formik.errors.cmnd)}
                helperText={formik.touched.cmnd && formik.errors.cmnd}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Assignment color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Địa Chỉ"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Số điện thoại"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              sx={{ mr: 1 }}
              disabled={activeStep === 0}
            >
              Quay lại
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 4,
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
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </Button>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleNext}
                  disabled={
                    activeStep === 0
                      ? !isStepOneComplete()
                      : activeStep === 1
                        ? !isStepTwoComplete()
                        : false
                  }
                  sx={{
                    py: 1.5,
                    px: 4,
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
                  Tiếp tục
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?{" "}
              <Link href="/auth/login" underline="hover">
                Đăng nhập ngay
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
