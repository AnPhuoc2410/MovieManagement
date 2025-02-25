import * as Yup from "yup";
import {
  FORGOT_PASSWORD_VALIDATION_MESSAGE,
  LOGIN_VALIDATION_MESSAGE,
  REGISTER_VALIDATION_MESSAGE,
} from "../constants/validation.message";
import { emailRegex, passwordRegex } from "../constants/regex";

export const forgotPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required(FORGOT_PASSWORD_VALIDATION_MESSAGE.PASSWORD_IS_REQUIRED)
    .min(8, FORGOT_PASSWORD_VALIDATION_MESSAGE.PASSWORD_MIN_LENGTH)
    .matches(passwordRegex, FORGOT_PASSWORD_VALIDATION_MESSAGE.PASSWORD_FORMAT),
  confirmPassword: Yup.string()
    .required(FORGOT_PASSWORD_VALIDATION_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED)
    .oneOf(
      [Yup.ref("password")],
      FORGOT_PASSWORD_VALIDATION_MESSAGE.PASSWORD_MISMATCH,
    ),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email(LOGIN_VALIDATION_MESSAGE.INVALID_EMAIL)
    .required(LOGIN_VALIDATION_MESSAGE.EMAIL_IS_REQUIRED),
  password: Yup.string().required(
    LOGIN_VALIDATION_MESSAGE.PASSWORD_IS_REQUIRED,
  ),
  rememberMe: Yup.boolean(),
});

export const registerValidationSchema = Yup.object().shape({
  first_name: Yup.string().required(
    REGISTER_VALIDATION_MESSAGE.FIRST_NAME_IS_REQUIRED,
  ),
  last_name: Yup.string().required(
    REGISTER_VALIDATION_MESSAGE.LAST_NAME_IS_REQUIRED,
  ),
  email: Yup.string()
    .required(REGISTER_VALIDATION_MESSAGE.EMAIL_IS_REQUIRED)
    .email(REGISTER_VALIDATION_MESSAGE.INVALID_EMAIL)
    .matches(emailRegex, REGISTER_VALIDATION_MESSAGE.EMAIL_FORMAT),
  password: Yup.string()
    .required(REGISTER_VALIDATION_MESSAGE.PASSWORD_IS_REQUIRED)
    .min(8, REGISTER_VALIDATION_MESSAGE.PASSWORD_MIN_LENGTH)
    .matches(passwordRegex, REGISTER_VALIDATION_MESSAGE.PASSWORD_FORMAT),
  confirm_password: Yup.string()
    .required(REGISTER_VALIDATION_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED)
    .oneOf(
      [Yup.ref("password")],
      REGISTER_VALIDATION_MESSAGE.PASSWORD_MISMATCH,
    ),
  receiveEmailNotifications: Yup.boolean(),
  acceptPolicy: Yup.boolean().oneOf(
    [true],
    REGISTER_VALIDATION_MESSAGE.ACCEPT_POLICY,
  ),
});
