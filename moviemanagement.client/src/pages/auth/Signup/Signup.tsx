import { Assignment, Badge, Cake, Email, Home, Lock, Person, Phone, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, Link, Radio, RadioGroup, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { signup } from "../../../apis/auth.apis";
import { signUpValidationSchema } from "../../../utils/validation.utils";
import { buttonStyle, iconStyle, stepperStyle, textFieldStyle } from "./Signup.style";

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const steps = [t("auth.signup.steps.account"), t("auth.signup.steps.personal"), t("auth.signup.steps.contact")];

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
    validationSchema: signUpValidationSchema(t),
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
    const hasErrors = Boolean(formik.errors.fullName || formik.errors.birthDate || formik.errors.gender || formik.errors.idCard);
    const isTouched = formik.touched.fullName || formik.touched.birthDate || formik.touched.gender || formik.touched.idCard;
    const hasValues = Boolean(formik.values.fullName && formik.values.birthDate && formik.values.gender && formik.values.idCard);
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
                      {showPassword ? <VisibilityOff sx={iconStyle} /> : <Visibility sx={iconStyle} />}
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
              error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
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
              <RadioGroup row name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                <FormControlLabel value="male" control={<Radio />} label={t("auth.signup.fields.male")} />
                <FormControlLabel value="female" control={<Radio />} label={t("auth.signup.fields.female")} />
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
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
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
          <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0} sx={buttonStyle.secondary}>
            {t("auth.signup.buttons.back")}
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button variant="contained" type="submit" disabled={loading} sx={buttonStyle.primary}>
              {loading ? t("auth.signup.buttons.processing") : t("auth.signup.buttons.signup")}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext} disabled={activeStep === 0 ? !isStepOneComplete() : activeStep === 1 ? !isStepTwoComplete() : false} sx={buttonStyle.primary}>
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
