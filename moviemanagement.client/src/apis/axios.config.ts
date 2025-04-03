import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "../utils/cookieUtils.ts";
import { getLanguageHeader } from "../utils/language.utils.ts";
import { ENV } from "../env/env.config.ts";

const api = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: false,
});

const handleBefore = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const token = getCookie("accessToken");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  const language = getLanguageHeader(localStorage.getItem("language") || "vi");
  config.headers.set("Accept-Language", language);
  return config;
};

const handleError = (error: AxiosError): Promise<AxiosError> => {
  console.log(error);
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
