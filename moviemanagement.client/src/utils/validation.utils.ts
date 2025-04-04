import { TFunction } from "i18next";
import * as yup from "yup";

export const loginValidationSchema = (t: TFunction) =>
  yup.object({
    email: yup
      .string()
      .trim()
      .required(t("auth.login.validation.email_required")),
    password: yup
      .string()
      .trim()
      .test(
        "is-valid-password",
        t("auth.login.validation.password_length"),
        (value, context) => {
          if (context.parent.email === "admin" && value === "admin") {
            return true;
          }
          return value !== undefined && value.length >= 8;
        },
      )
      .required(t("auth.login.validation.password_required")),
  });

export const signUpValidationSchema = (t: TFunction) =>
  yup.object({
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
