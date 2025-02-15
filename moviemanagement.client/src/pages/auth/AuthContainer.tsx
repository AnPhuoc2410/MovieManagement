import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { register } from "../../apis/auth.apis";
import CheckboxField from "../../components/forms/CheckboxField";
import FancyFormField from "../../components/shared/FancyFormField";
import { ROUTING_PATH } from "../../constants/endPoints";
import { GENERAL_TOAST_MESSAGE } from "../../constants/message";
import { useAuth } from "../../contexts/AuthContext";
import { SampleMemberProfiles } from "../../data/user.data";
import { LoginDTO, UserRegisterDTO } from "../../types/users.type";
import { extractErrorMessage } from "../../utils/errors.utils";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "../../utils/validation.utils";
import styles from "./styles.module.css";

const LoginForm = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginDTO) => {
    const user = { ...data };
    for (let i = 0; i < SampleMemberProfiles.length; i++) {
      if (
        user.email === SampleMemberProfiles[i].Email &&
        user.password === SampleMemberProfiles[i].MatKhau
      ) {
        const foundUser = SampleMemberProfiles[i];

        try {
          toast.success("Login successfully!");
          setTimeout(() => {
            navigate(`/users/profile/${foundUser.MaThanhVien}`);
          }, 2000);
        } catch (error) {
          const errorMessage = extractErrorMessage(
            error,
            "An error occurred during login",
          );
          toast.error(errorMessage);
        }
        return;
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Sign In</h1>
      <FancyFormField
        name="email"
        label="Email Address"
        type="email"
        control={control}
        errors={errors}
      />
      <FancyFormField
        name="password"
        label="Password"
        type="password"
        control={control}
        errors={errors}
      />
      <div className="flex justify-between items-center w-full">
        <button
          type="button"
          onClick={() => {
            alert("This feature is not available yet");
          }}
          className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          Forgot password?
        </button>
        <CheckboxField
          name="rememberMe"
          label="Remember me"
          control={control}
          errors={errors}
        />
      </div>
      <button className={styles.formButton}>Sign In</button>
      <div className="flex flex-col items-center">
        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/2 mx-auto"></span>
      </div>
    </form>
  );
};

const RegisterForm = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      receiveEmailNotifications: true,
      acceptPolicy: true,
    },
  });

  const onSubmit = async (data: UserRegisterDTO) => {
    try {
      const response = await register(data);

      if (response.status_code !== 201) {
        throw new Error(response.reason);
      }

      toast.success(GENERAL_TOAST_MESSAGE.REGISTER_SUCCESSFULLY);
      setTimeout(() => {
        navigate(ROUTING_PATH.OTP_VERIFICATION, {
          state: {
            email: data.email,
            from: "register",
            statusCode: 200,
          },
        });
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Sign Up</h1>

      <div className={styles.nameFieldsContainer}>
        <div className={styles.inputGroup}>
          <FancyFormField
            name="first_name"
            label="First Name"
            control={control}
            errors={errors}
          />
        </div>
        <div className={styles.inputGroup}>
          <FancyFormField
            name="last_name"
            label="Last Name"
            control={control}
            errors={errors}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <FancyFormField
          name="email"
          label="Email Address"
          type="email"
          control={control}
          errors={errors}
        />
      </div>

      <div className={styles.inputGroup}>
        <FancyFormField
          name="password"
          label="Password"
          type="password"
          control={control}
          errors={errors}
        />
      </div>

      <div className={styles.inputGroup}>
        <FancyFormField
          name="confirm_password"
          label="Confirm Password"
          type="password"
          control={control}
          errors={errors}
        />
      </div>

      <div className={styles.checkboxGroup}>
        <CheckboxField
          name="acceptPolicy"
          label="I agree to the terms and policy"
          control={control}
          errors={errors}
        />
      </div>
      <div className={styles.checkboxGroup}>
        <CheckboxField
          name="receiveEmailNotifications"
          label="Send me promotional emails about AuctionKoi auctions"
          control={control}
          errors={errors}
        />
      </div>

      <button className={styles.formButton}>Submit</button>
    </form>
  );
};

const Overlay = ({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <div className={styles.overlayContainer}>
    <div className={styles.overlay}>
      {!isActive ? (
        <div className={styles.overlayPanel}>
          <h1>Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <button
            className={styles.overlayButton}
            onClick={() => onToggle(true)}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className={styles.overlayPanel}>
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start journey with us</p>
          <button
            className={styles.overlayButton}
            onClick={() => onToggle(false)}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  </div>
);

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className={styles.full}>
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={`${styles.container} ${isActive ? styles.active : ""}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className={`${styles.formContainer} ${styles.signUp}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <RegisterForm />
            </motion.div>
            <motion.div
              className={`${styles.formContainer} ${styles.signIn}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LoginForm />
            </motion.div>
            <Overlay isActive={isActive} onToggle={setIsActive} />
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AuthContainer;
