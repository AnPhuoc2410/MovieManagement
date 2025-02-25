import axios, { AxiosError } from "axios";

type ErrorType = {
  message: string;
  reason: string;
};

export const handleAxiosError = (
  error: any | ErrorType | AxiosError,
  fallBackDefaultError: string,
  useReason: boolean = false, // Boolean to decide between 'reason' or 'message'
  fallBackAxiosError: string,
) => {
  if (!axios.isAxiosError(error)) {
    throw new Error(fallBackDefaultError);
  }

  // Decide which field to prioritize based on the boolean flag
  const errorField = useReason ? "reason" : "message";

  // Check if the error field exists in the response and throw the error message
  if (error.response?.data?.[errorField]) {
    throw new Error(error.response.data[errorField]);
  }

  // If neither exists, throw the fallback Axios error
  throw new Error(fallBackAxiosError);
};

export const extractErrorMessage = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || defaultMessage;
  } else if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
};
