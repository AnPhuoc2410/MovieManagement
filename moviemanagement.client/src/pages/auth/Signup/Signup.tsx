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
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { signUp } from "../../../apis/mock.apis";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [
    t("auth.signup.steps.account"),
    t("auth.signup.steps.personal"),
    t("auth.signup.steps.contact"),
  ];

  const validationSchema = yup.object({
    username: yup
      .string()
      .required(t("auth.login.validation.username_required")),
    password: yup
      .string()
      .min(8, t("auth.login.validation.password_length"))
      .required(t("auth.login.validation.password_required")),
    fullname: yup.string().required(t("auth.signup.fields.fullname")),
    dob: yup.date().required(t("auth.signup.fields.dob")),
    gender: yup.string().required(t("auth.signup.fields.gender")),
    cmnd: yup.string().required(t("auth.signup.fields.id_card")),
    email: yup
      .string()
      .email("Invalid email")
      .required(t("auth.signup.fields.email")),
    address: yup.string().required(t("auth.signup.fields.address")),
    phone: yup.string().required(t("auth.signup.fields.phone")),
  });

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
    onSubmit: async (values) => {
      setLoading(true);
      const toastId = toast.loading("Đang xác thực người dùng...");

      try {
        const response = await signUp(values);

        toast.dismiss(toastId);

        if (response.is_success) {
          toast.success("Đăng ký tài khoản thành công!");
          setTimeout(() => {
            navigate("/auth/login");
          }, 1000);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Đã xảy ra lỗi không mong muốn.");
      } finally {
        setLoading(false);
      }
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
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          {t("auth.signup.title")}
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
                label={t("auth.signup.fields.username")}
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
                label={t("auth.signup.fields.password")}
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
                label={t("auth.signup.fields.fullname")}
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
                label={t("auth.signup.fields.dob")}
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
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel>{t("auth.signup.fields.gender")}</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label={t("auth.signup.fields.male")}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label={t("auth.signup.fields.female")}
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                fullWidth
                id="cmnd"
                name="cmnd"
                label={t("auth.signup.fields.id_card")}
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
                label={t("auth.signup.fields.email")}
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
                label={t("auth.signup.fields.address")}
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
                label={t("auth.signup.fields.phone")}
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
              {t("auth.signup.buttons.back")}
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
                  {loading
                    ? t("auth.signup.buttons.processing")
                    : t("auth.signup.buttons.signup")}
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
                  {t("auth.signup.buttons.next")}
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("auth.signup.have_account")}{" "}
              <Link href="/auth/login" underline="hover">
                {t("auth.signup.login_link")}
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
