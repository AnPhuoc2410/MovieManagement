import { getCookie } from "./cookieUtils";

export const getUserCookieToken = (): string | null => {
  return getCookie("access_token");
};

export const isTokenValid = () => {
  const token = getUserCookieToken();
  return !!token; // Return true if token exists
};
