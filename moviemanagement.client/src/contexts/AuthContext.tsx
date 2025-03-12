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
        const token = getCookie("token");
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
      accessToken: userData.accessToken,
      expires: userData.expires,
    };

    // Set user data in the state
    setUser(authData);

    // Set cookies for necessary tokens and user data
    setCookie("accessToken", userData.accessToken, 1); // Set to expire in 1 day
  };

  const authLogout = async () => {
    const token = getCookie("accessToken");
    if (token) {
      await doLogout(token);
    }
    setIsAuthenticated(false);
    setUser(null);
    eraseCookie("accessToken");
    eraseCookie("expires");
    navigate("/");
  };

  const getToken = () => getCookie("accessToken");

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
