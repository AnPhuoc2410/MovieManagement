import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doLogout } from "../apis/auth.apis";
import { AuthLoginData } from "../types/auth.types";
import { eraseCookie, getCookie, setCookie } from "../utils/cookieUtils";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthLoginData | null;
  authLogin: (userData: AuthLoginData) => void;
  authLogout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<AuthLoginData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Validate token and set user
          setIsAuthenticated(true);
          // Set user data
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const authLogin = (userData: AuthLoginData) => {
    if (!userData) {
      console.error("Invalid login data");
      return;
    }

    // Set login state
    setIsAuthenticated(true);

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
    setIsAuthenticated(false);
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
      value={{
        isAuthenticated,
        isInitialized,
        user,
        authLogin,
        authLogout,
        getToken,
      }}
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
