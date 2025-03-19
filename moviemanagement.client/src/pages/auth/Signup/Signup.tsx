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
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { signup } from "../../../apis/auth.apis";
import AuthForm from "../AuthForm";

const textFieldStyle = {
  mb: 3,
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#e6c300",
    },
    "&.Mui-error fieldset": {
      borderColor: "#ff9800",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    "&.Mui-focused": {
      color: "#000",
    },
    "&.Mui-error": {
      color: "#ff9800",
    },
  },
  "& .MuiFormHelperText-root": {
    "&.Mui-error": {
      color: "#ff9800",
    },
  },
};

const iconStyle = {
  color: "#666",
};

const stepperStyle = {
  mb: 4,
  "& .MuiStepLabel-root .Mui-completed": {
    color: "#e6c300",
  },
  "& .MuiStepLabel-root .Mui-active": {
    color: "#e6c300",
  },
  "& .MuiStepLabel-label": {
    color: "#666",
    "&.Mui-active": {
      color: "#000",
    },
    "&.Mui-completed": {
      color: "#000",
    },
  },
};

const buttonStyle = {
  primary: {
    backgroundColor: "#e6c300",
    color: "black",
    py: 1.5,
    px: 4,
    borderRadius: 1.5,
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 500,
    boxShadow: 2,
    "&:hover": {
      backgroundColor: "#ccad00",
      boxShadow: 4,
    },
    "&:disabled": {
      backgroundColor: "#e0e0e0",
      color: "#9e9e9e",
    },
  },
  secondary: {
    borderColor: "#e6c300",
    color: "black",
    "&:hover": {
      borderColor: "#ccad00",
      backgroundColor: "rgba(230, 195, 0, 0.1)",
    },
    "&:disabled": {
      borderColor: "#e0e0e0",
      color: "#9e9e9e",
    },
  },
};

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
    userName: yup
      .string()
      .required(t("auth.login.validation.username_required")),
    password: yup
      .string()
      .min(8, t("auth.login.validation.password_length"))
      .required(t("auth.login.validation.password_required")),
    fullName: yup
      .string()
      .required(t("auth.signup.validation.fullname_required")),
    birthDate: yup
      .date()
      .required(t("auth.signup.validation.birthdate_required")),
    gender: yup.string().required(t("auth.signup.validation.gender_required")),
    idCard: yup.string().required(t("auth.signup.validation.id_card_required")),
    email: yup
      .string()
      .email(t("auth.signup.validation.email.invalid"))
      .required(t("auth.signup.validation.email.required")),
    address: yup
      .string()
      .required(t("auth.signup.validation.address_required")),
    phoneNumber: yup
      .string()
      .required(t("auth.signup.validation.phone_required")),
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
      userName: "",
      password: "",
      fullName: "",
      birthDate: "",
      gender: "",
      idCard: "",
      email: "",
      address: "",
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const toastId = toast.loading("Đang xác thực người dùng...");

      try {
        const response = await signup(values);

        // Always dismiss the loading toast first
        toast.dismiss(toastId);

        if (response.isSuccess) {
          toast.success("Đăng ký tài khoản thành công!", {
            duration: 3000, // Stay visible for 3 seconds
          });

          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          // Make sure error toast stays visible longer
          toast.error(response.reason || response.message, {
            duration: 5000, // Stay visible for 5 seconds
          });
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Đã xảy ra lỗi không mong muốn.", {
          duration: 5000, // Stay visible for 5 seconds
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const isStepOneComplete = () => {
    const hasErrors = Boolean(formik.errors.userName || formik.errors.password);
    const isTouched = formik.touched.userName || formik.touched.password;
    const hasValues = Boolean(formik.values.userName && formik.values.password);
    return hasValues && (!isTouched || !hasErrors);
  };

  const isStepTwoComplete = () => {
    const hasErrors = Boolean(
      formik.errors.fullName ||
        formik.errors.birthDate ||
        formik.errors.gender ||
        formik.errors.idCard,
    );
    const isTouched =
      formik.touched.fullName ||
      formik.touched.birthDate ||
      formik.touched.gender ||
      formik.touched.idCard;
    const hasValues = Boolean(
      formik.values.fullName &&
        formik.values.birthDate &&
        formik.values.gender &&
        formik.values.idCard,
    );
    return hasValues && (!isTouched || !hasErrors);
  };

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <Stepper activeStep={activeStep} sx={stepperStyle}>
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
              id="userName"
              name="userName"
              label={t("auth.signup.fields.username")}
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
              sx={textFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={iconStyle} />
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
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={textFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={iconStyle} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? (
                        <VisibilityOff sx={iconStyle} />
                      ) : (
                        <Visibility sx={iconStyle} />
                      )}
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
              id="fullName"
              name="fullName"
              label={t("auth.signup.fields.fullname")}
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              sx={textFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge sx={iconStyle} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              id="birthDate"
              name="birthDate"
              label={t("auth.signup.fields.dob")}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formik.values.birthDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.birthDate && Boolean(formik.errors.birthDate)
              }
              helperText={formik.touched.birthDate && formik.errors.birthDate}
              sx={textFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Cake sx={iconStyle} />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl component="fieldset" sx={textFieldStyle}>
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
              id="idCard"
              name="idCard"
              label={t("auth.signup.fields.id_card")}
              value={formik.values.idCard}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.idCard && Boolean(formik.errors.idCard)}
              helperText={formik.touched.idCard && formik.errors.idCard}
              sx={textFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Assignment sx={iconStyle} />
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
              sx={textFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={iconStyle} />
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
              sx={textFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home sx={iconStyle} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label={t("auth.signup.fields.phone_number")}
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              sx={textFieldStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={iconStyle} />
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
            disabled={activeStep === 0}
            sx={buttonStyle.secondary}
          >
            {t("auth.signup.buttons.back")}
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={buttonStyle.primary}
            >
              {loading
                ? t("auth.signup.buttons.processing")
                : t("auth.signup.buttons.signup")}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                activeStep === 0
                  ? !isStepOneComplete()
                  : activeStep === 1
                    ? !isStepTwoComplete()
                    : false
              }
              sx={buttonStyle.primary}
            >
              {t("auth.signup.buttons.next")}
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#666" }}>
            {t("auth.signup.have_account")}{" "}
            <Link
              href="/auth/login"
              underline="hover"
              sx={{
                color: "#e6c300",
                "&:hover": {
                  color: "#ccad00",
                },
              }}
            >
              {t("auth.signup.login_link")}
            </Link>
          </Typography>
        </Box>
      </form>
    </div>
  );
};
