import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  Fade,
  Link,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  doSendOTPToExistUser,
  doUpdatePassword,
} from "../../../apis/auth.apis";
import { verifyOtpIsCorrect } from "../../../apis/otp.apis";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [timeRemaining, setTimeRemaining] = useState<number>(5 * 60); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize refs array for OTP inputs
  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    // Start the timer when OTP step is active
    if (step === "otp") {
      setTimeRemaining(5 * 60);
      setTimerActive(true);
    } else {
      // Clear the timer if we're not on the OTP step
      setTimerActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [step]);

  // Add this useEffect to handle the countdown logic
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Time's up - clear interval and redirect
            clearInterval(timerRef.current!);
            toast.error(
              t(
                "auth.forgot_password.toast.otp_expired",
                "OTP session expired",
              ),
            );
            navigate("/");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, navigate, t]);

  // Add this helper function to format the remaining time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("auth.forgot_password.validation.email_invalid"))
      .required(t("auth.forgot_password.validation.email_required")),
  });

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t("auth.forgot_password.validation.password_required"))
      .min(8, t("auth.forgot_password.validation.password_length")),
    confirmPassword: Yup.string()
      .required(t("auth.forgot_password.validation.confirm_required"))
      .oneOf(
        [Yup.ref("password")],
        t("auth.forgot_password.validation.passwords_match"),
      ),
  });

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: yupResolver(emailValidationSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: yupResolver(passwordValidationSchema),
  });

  const onEmailSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      // Add your email verification API call here
      const res = await doSendOTPToExistUser(data.email);

      if (!res) {
        toast.error(t("auth.forgot_password.toast.email_not_found"));
        setIsLoading(false);
        return;
      }
      localStorage.setItem("otp", res);
      setEmail(data.email);
      // Instead of going directly to reset, go to OTP verification
      setStep("otp");
      toast.success(
        t("auth.forgot_password.toast.otp_sent", "OTP sent to your email"),
      );
      setIsLoading(false);
    } catch (error) {
      toast.error(t("auth.forgot_password.toast.email_failed"));
      setIsLoading(false);
    }
  };

  const handleOtpChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Only allow numbers
      if (value && !/^\d+$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    };

  const handleOtpKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle backspace
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error(
        t(
          "auth.forgot_password.toast.invalid_otp",
          "Please enter a valid 6-digit OTP",
        ),
      );
      return;
    }

    try {
      setIsLoading(true);
      // Call your OTP verification API
      const isMatchOtpWithEmail = await verifyOtpIsCorrect(email, otpString);

      if (!isMatchOtpWithEmail) {
        toast.error(
          t(
            "auth.forgot_password.toast.otp_failed",
            "Invalid OTP. Please try again.",
          ),
        );
        setIsLoading(false);
        return;
      }

      toast.success(
        t(
          "auth.forgot_password.toast.otp_verified",
          "OTP verified successfully",
        ),
      );
      localStorage.removeItem("otp");
      setStep("reset");
      setIsLoading(false);
    } catch (error) {
      toast.error(
        t(
          "auth.forgot_password.toast.otp_failed",
          "Invalid OTP. Please try again.",
        ),
      );
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: { password: string }) => {
    try {
      setIsLoading(true);

      const isUpdateSuccess = await doUpdatePassword({
        email,
        newPassword: data.password,
      });

      if (!isUpdateSuccess) {
        toast.error(t("auth.forgot_password.toast.reset_failed"));
        setIsLoading(false);
        return;
      }

      toast.success(t("auth.forgot_password.toast.reset_success"));
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error) {
      toast.error(t("auth.forgot_password.toast.reset_failed"));
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      // Add your resend OTP API call here
      toast.success(
        t("auth.forgot_password.toast.otp_resent", "OTP resent to your email"),
      );
      setIsLoading(false);
    } catch (error) {
      toast.error(
        t(
          "auth.forgot_password.toast.otp_resend_failed",
          "Failed to resend OTP",
        ),
      );
      setIsLoading(false);
    }
  };

  const renderStepTitle = () => {
    switch (step) {
      case "email":
        return t("auth.forgot_password.title");
      case "otp":
        return t("auth.forgot_password.otp_title", "Verify OTP");
      case "reset":
        return t("auth.forgot_password.reset_title");
      default:
        return "";
    }
  };

  const renderStepSubtitle = () => {
    switch (step) {
      case "email":
        return t(
          "auth.forgot_password.subtitle",
          "Enter your email to reset your password",
        );
      case "otp":
        return t(
          "auth.forgot_password.otp_subtitle",
          `Enter the 6-digit code sent to ${email}`,
        );
      case "reset":
        return t(
          "auth.forgot_password.reset_subtitle",
          `Creating new password for ${email}`,
        );
      default:
        return "";
    }
  };

  return (
    <MainLayout>
      <Container
        maxWidth="sm"
        sx={{
          mt: { xs: 4, md: 8, lg: 12 },
        }}
      >
        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              mt: { xs: 4, md: 8 },
              mb: { xs: 4, md: 8 },
              py: { xs: 3, md: 4 },
              px: { xs: 3, md: 5 },
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "primary.main",
                }}
              >
                {renderStepTitle()}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 4 }}
              >
                {renderStepSubtitle()}
              </Typography>

              {step === "email" && (
                <Box
                  component="form"
                  onSubmit={handleEmailSubmit(onEmailSubmit)}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={t("auth.forgot_password.email_label")}
                    {...registerEmail("email")}
                    error={!!emailErrors.email}
                    helperText={emailErrors.email?.message}
                    sx={{ mb: 3 }}
                    autoComplete="email"
                    autoFocus
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      mt: 2,
                      mb: 2,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{ mr: 1, color: "inherit" }}
                        />
                        {t("auth.forgot_password.sending", "Sending...")}
                      </>
                    ) : (
                      t("auth.forgot_password.send_link")
                    )}
                  </Button>
                </Box>
              )}

              {step === "otp" && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                      mb: 4,
                      width: "100%",
                    }}
                  >
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => (otpRefs.current[index] = el)}
                        value={digit}
                        onChange={handleOtpChange(index)}
                        onKeyDown={handleOtpKeyDown(index)}
                        variant="outlined"
                        inputProps={{
                          maxLength: 1,
                          style: {
                            textAlign: "center",
                            fontSize: "1.5rem",
                            padding: "12px 0",
                          },
                        }}
                        sx={{
                          width: "3rem",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                          },
                        }}
                        autoFocus={index === 0}
                      />
                    ))}
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 3 }}
                  >
                    {t(
                      "auth.forgot_password.otp_instruction",
                      "Please enter the 6-digit one time password (OTP) that was sent to your email",
                    )}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyOtp}
                    size="large"
                    disabled={isLoading || otp.join("").length !== 6}
                    sx={{
                      mt: 2,
                      mb: 2,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{ mr: 1, color: "inherit" }}
                        />
                        {t("auth.forgot_password.verifying", "Verifying...")}
                      </>
                    ) : (
                      t("auth.forgot_password.verify_otp", "Verify OTP")
                    )}
                  </Button>

                  <Typography
                    variant="body2"
                    color="error"
                    align="center"
                    sx={{ mb: 2 }}
                  >
                    {t(
                      "auth.forgot_password.otp_timer",
                      "Time remaining: {{time}}",
                    ).replace("{{time}}", formatTime(timeRemaining))}
                  </Typography>

                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      sx={{ color: "primary.main" }}
                    >
                      {t("auth.forgot_password.resend_otp", "Resend OTP")}
                    </Link>
                  </Box>
                </Box>
              )}

              {step === "reset" && (
                <Box
                  component="form"
                  onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    label={t("auth.forgot_password.new_password")}
                    {...registerPassword("password")}
                    error={!!passwordErrors.password}
                    helperText={passwordErrors.password?.message}
                    sx={{ mb: 3 }}
                    autoFocus
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    variant="outlined"
                    label={t("auth.forgot_password.confirm_password")}
                    {...registerPassword("confirmPassword")}
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword?.message}
                    sx={{ mb: 3 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPasswordVisibility}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      mt: 2,
                      mb: 2,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{ mr: 1, color: "inherit" }}
                        />
                        {t("auth.forgot_password.resetting", "Resetting...")}
                      </>
                    ) : (
                      t("auth.forgot_password.reset_button")
                    )}
                  </Button>
                </Box>
              )}

              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleBackToLogin}
                  sx={{ color: "text.secondary" }}
                >
                  {t("auth.forgot_password.back_to_login", "Back to Login")}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </MainLayout>
  );
};

export default ForgotPassword;
