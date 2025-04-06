import { Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  // Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  // Link,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import { login } from "../../../apis/auth.apis";
import { useAuth } from "../../../contexts/AuthContext";
import { ENV } from "../../../env/env.config";
import { loginValidationSchema } from "../../../utils/validation.utils";
import { textFieldStyle } from "./Login.style";
// import { GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });
  const navigate = useNavigate();
  const { authLogin } = useAuth();
  const { t } = useTranslation();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setRememberMe(checked);
    localStorage.setItem("rememberMe", checked.toString());
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const resetCaptcha = () => {
    console.log("Resetting captcha", recaptchaRef.current);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setCaptchaToken(null);
    } else {
      console.error("ReCAPTCHA ref is not available");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem("rememberMe") === "true" ? localStorage.getItem("lastLoginEmail") || "" : "",
      password: "",
    },
    validationSchema: loginValidationSchema(t),
    onSubmit: async (values) => {
      // Trim the values before submitting
      const trimmedValues = {
        email: values.email.trim(),
        password: values.password.trim(),
      };

      if (!captchaToken) {
        toast.error(t("auth.login.captcha_required"));
        resetCaptcha();
        return;
      }

      setLoading(true);
      const toastId = toast.loading(t("auth.login.logging_in"));

      try {
        const response = await login({
          ...trimmedValues,
        });
        toast.dismiss(toastId);

        if (response) {
          const tokenData = response.data.token;

          // Save email for remember me
          if (rememberMe) {
            localStorage.setItem("lastLoginEmail", trimmedValues.email);
          } else {
            localStorage.removeItem("lastLoginEmail");
          }

          // Login and extract user details through auth context
          const userDetails = await authLogin({
            accessToken: tokenData.accessToken,
            expires: tokenData.expires,
          });

          toast.success(t("auth.login.welcome_message", { name: userDetails?.fullName }));

          // After login, get the stored redirect path from localStorage
          const redirectTo = localStorage.getItem("redirectTo") || "/";

          // Clear the redirect path from localStorage
          localStorage.removeItem("redirectTo");

          // Redirect to the page they were trying to visit
          navigate(redirectTo, { replace: true });
        } else {
          toast.error("Wrong email or password");

          console.log("Login fail");

          // Reset captcha on failed login attempt
          resetCaptcha();
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error(t("auth.login.wrong_credentials"));
        // Reset captcha on error
        resetCaptcha();
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "#1a1a1a" }}>
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
                {showPassword ? <VisibilityOff sx={{ color: "#666" }} /> : <Visibility sx={{ color: "#666" }} />}
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

        <RouterLink
          to="/auth/forgot-password"
          style={{
            fontSize: "0.875rem",
            color: "black",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
        >
          {t("auth.login.forgot_password")}
        </RouterLink>
      </Box>

      <Box sx={{ mb: 3 }}>
        <ReCAPTCHA ref={recaptchaRef} sitekey={ENV.RECAPTCHA_V2_SITE_KEY} onChange={handleCaptchaChange} theme="light" size="normal" />
        {!captchaToken && (
          <Typography variant="caption" sx={{ color: "#666", mt: 1, display: "block" }}>
            {t("auth.login.please_complete_captcha")}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        fullWidth
        type="submit"
        disabled={loading || !captchaToken}
        sx={{
          backgroundColor: !captchaToken ? "#f5f5f5" : "#e6c300",
          color: !captchaToken ? "#bdbdbd" : "black",
          py: 1.5,
          height: "48px",
          borderRadius: 1.5,
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 500,
          boxShadow: 2,
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: !captchaToken ? "#f5f5f5" : "#e6c300",
            boxShadow: !captchaToken ? 1 : 4,
          },
          "&:disabled": {
            backgroundColor: "#fafafa",
            color: "#bdbdbd",
          },
        }}
      >
        {loading ? t("auth.login.processing") : !captchaToken ? t("auth.login.complete_captcha_to_continue") : t("auth.login.login_button")}
      </Button>

      {/*<Divider sx={{ my: 1.5 }} />*/}

      {/*<Box*/}
      {/*  sx={{*/}
      {/*    display: "flex",*/}
      {/*    flexDirection: "column",*/}
      {/*    justifyContent: "center",*/}
      {/*    alignItems: "center",*/}
      {/*    gap: 1,*/}
      {/*    pl: 4,*/}
      {/*    pr: 4,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Typography>Or</Typography>*/}
      {/*  <GoogleLogin*/}
      {/*    onSuccess={(credentialResponse) => {*/}
      {/*      console.log(credentialResponse);*/}
      {/*    }}*/}
      {/*    onError={() => {*/}
      {/*      toast.error("Google login failed");*/}
      {/*    }}*/}
      {/*    useOneTap*/}
      {/*    shape="pill"*/}
      {/*  />*/}
      {/*</Box>*/}
    </form>
  );
};
