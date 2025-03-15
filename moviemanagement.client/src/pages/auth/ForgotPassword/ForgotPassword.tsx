import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Footer from "../../../components/home/Footer";
import Header from "../../../components/home/Header";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      // Add your email verification API call here
      setEmail(data.email);
      setStep("reset");
      toast.success(t("auth.forgot_password.toast.email_sent"));
    } catch (error) {
      toast.error(t("auth.forgot_password.toast.email_failed"));
    }
  };

  const onPasswordSubmit = async (data: { password: string }) => {
    try {
      // Add your password reset API call here
      toast.success(t("auth.forgot_password.toast.reset_success"));
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error) {
      toast.error(t("auth.forgot_password.toast.reset_failed"));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(34, 27, 66, 0.7) 40%, rgba(73, 50, 129, 0.7) 100%)`,
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Header isTransparent={false} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minHeight: "calc(100vh - 200px)",
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, color: "white" }}>
          {step === "email"
            ? t("auth.forgot_password.title")
            : t("auth.forgot_password.reset_title")}
        </Typography>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit(onEmailSubmit)}>
            <TextField
              fullWidth
              label={t("auth.forgot_password.email_label")}
              {...registerEmail("email")}
              error={!!emailErrors.email}
              helperText={emailErrors.email?.message}
              sx={{ mb: 3 }}
            />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
              {t("auth.forgot_password.send_link")}
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <TextField
              fullWidth
              type="password"
              label={t("auth.forgot_password.new_password")}
              {...registerPassword("password")}
              error={!!passwordErrors.password}
              helperText={passwordErrors.password?.message}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              type="password"
              label={t("auth.forgot_password.confirm_password")}
              {...registerPassword("confirmPassword")}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword?.message}
              sx={{ mb: 3 }}
            />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
              {t("auth.forgot_password.reset_button")}
            </Button>
          </form>
        )}
      </Box>

      <Footer />
    </Box>
  );
};

export default ForgotPassword;
