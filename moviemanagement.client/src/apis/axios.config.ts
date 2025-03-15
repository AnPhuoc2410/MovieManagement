import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "../utils/cookieUtils.ts";
import { ENV } from "../env/env.config.ts";

const api = axios.create({
  baseURL: ENV.API_URL,
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
