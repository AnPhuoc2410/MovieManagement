import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "../utils/cookieUtils.ts";

const api = axios.create({
  baseURL: "https://localhost:7119/api/",
  withCredentials: false, // Include credentials with requests
});

const handleBefore = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = getCookie("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
};

const handleError = (error: AxiosError): Promise<AxiosError> => {
  console.log(error);
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
