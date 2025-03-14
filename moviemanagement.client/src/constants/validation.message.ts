export const LOGIN_VALIDATION_MESSAGE = {
  EMAIL_IS_REQUIRED: "Email is required",
  INVALID_EMAIL: "Invalid email address",
  PASSWORD_IS_REQUIRED: "Password is required",
} as const;

export const REGISTER_VALIDATION_MESSAGE = {
  FIRST_NAME_IS_REQUIRED: "First name is required",
  LAST_NAME_IS_REQUIRED: "Last name is required",
  EMAIL_IS_REQUIRED: "Email is required",
  INVALID_EMAIL: "Invalid email address",
  EMAIL_FORMAT: "Email must a valid email address",
  PASSWORD_IS_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
  PASSWORD_FORMAT:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  CONFIRM_PASSWORD_IS_REQUIRED: "Confirm Password is required",
  PASSWORD_MISMATCH: "Passwords must match",
  ACCEPT_POLICY: "You must accept the policy",
} as const;

export const FORGOT_PASSWORD_VALIDATION_MESSAGE = {
  PASSWORD_IS_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
  PASSWORD_FORMAT:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  CONFIRM_PASSWORD_IS_REQUIRED: "Confirm Password is required",
  PASSWORD_MISMATCH: "Passwords must match confirm password",
} as const;

export const KOI_CREATE_VALIDATION_MESSAGE = {
  KOI_NAME_IS_REQUIRED: "Koi name is required",
  KOI_NAME_MUST_FOLLOWING_FORMAT:
    "Koi name must not contain any number, every first letter need capitalized, not contain any punctuation",
  BASE_PRICE_IS_REQUIRED: "Base price is required",
  BASE_PRICE_GREATER_THAN_1_MILLION:
    "Base koi price must be equals or greater than 1.000.000 VND and equals or less than 50.000.000 VND",
  GENDER_IS_REQUIRED: "Gender is required",
  LENGTH_IS_REQUIRED: "Length is required",
  LENGTH_MUST_BE_GREATER_THAN_ZERO_AND_LESS_THAN_125:
    "Length must be equals or greater than 0(cm) and equals or less than 125(cm)",
  YEAR_BORN_IS_REQUIRED: "Year born is required",
  YEAR_BORN_CANNOT_BE_NEGATIVE: "Year born cannot be negative",
  YEAR_BORN_CANNOT_BE_IN_FUTURE: "Year born cannot be in the future",
  CATEGORY_IS_REQUIRED: "Category is required",
  THUMBNAIL_URL_IS_REQUIRED: "Thumbnail URL is required",
  IS_DISPLAY_IS_REQUIRED: "Is display is required",
} as const;

export const SNACKBAR_VALIDATION_MESSAGE = {
  PLEASE_FIX_THE_ERRORS_IN_THE_FORM: "Please fix the errors in the form",
  KOI_CREATE_SUCCESS: "Koi created successfully!",
  KOI_UPDATE_SUCCESS: "Koi updated successfully!",
  KOI_DELETE_SUCCESS: "Koi deleted successfully!",
} as const;

export const GENERAL_VALIDATION_MESSAGE = {
  PLEASE_FIX_THE_ERRORS_IN_THE_FORM: "Please fix the errors in the form",
} as const;
