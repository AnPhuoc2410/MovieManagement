import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doLogout } from "../apis/auth.apis";
import { AuthLoginData } from "../types/auth.types";
import { eraseCookie, getCookie, setCookie } from "../utils/cookieUtils";

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthLoginData | null;
  authLogin: (userData: AuthLoginData) => void;
  authLogout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthLoginData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = getCookie("access_token");
    if (access_token) {
      const access_token = getCookie("access_token") || "";
      const token_type = getCookie("token_type") || "";
      const expires = getCookie("expires") || "";
      const is_mobile = getCookie("is_mobile") === "true";

      setIsLoggedIn(true);
      setUser({
        access_token,
        token_type,
        expires,
        is_mobile,
      });
    }
  }, []);

  const authLogin = (userData: AuthLoginData) => {
    if (!userData) {
      console.error("Invalid login data");
      return;
    }

    // Set login state
    setIsLoggedIn(true);

    // Create authData with token details
    const authData: AuthLoginData = {
      access_token: userData.access_token,
      token_type: userData.token_type,
      expires: userData.expires,
      is_mobile: userData.is_mobile,
    };

    // Set user data in the state
    setUser(authData);

    // Set cookies for necessary tokens and user data
    setCookie("access_token", userData.access_token, 1); // Set to expire in 1 day
  };

  const authLogout = async () => {
    const token = getCookie("access_token");
    if (token) {
      await doLogout(token);
    }
    setIsLoggedIn(false);
    setUser(null);
    eraseCookie("access_token");
    eraseCookie("token_type");
    eraseCookie("expires");
    eraseCookie("is_mobile");
    navigate("/");
  };

  const getToken = () => getCookie("access_token");

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, authLogin, authLogout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
