import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doExtractUserFromToken, doLogout } from "../apis/auth.apis";
import { AuthLoginData } from "../types/auth.types";
import { eraseCookie, getCookie, setCookie } from "../utils/cookieUtils";
import toast from "react-hot-toast";
import { UserResponse } from "../types/users.type";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  authData: AuthLoginData | null;
  userDetails: UserResponse | null;
  authLogin: (userData: AuthLoginData) => Promise<UserResponse | null>;
  authLogout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authData, setAuthData] = useState<AuthLoginData | null>(null); // Store token-related info
  const [userDetails, setUserDetails] = useState<UserResponse | null>(null); // Store user-related info
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getCookie("accessToken");
        if (token) {
          // Extract user details from token
          const { data } = await doExtractUserFromToken(token);

          console.log(`User details: ${JSON.stringify(data, null, 2)}`);

          if (data) {
            setIsAuthenticated(true);
            setUserDetails(data); // Set user details from token
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const authLogin = async (
    loginData: AuthLoginData,
  ): Promise<UserResponse | null> => {
    if (!loginData) {
      console.error("Invalid login data");
      return null;
    }

    try {
      // Set login state and store token
      setIsAuthenticated(true);
      setAuthData(loginData);
      setCookie("accessToken", loginData.accessToken, 1);
      setCookie("expires", loginData.expires, 1);

      // Extract and store user details
      const { data } = await doExtractUserFromToken(loginData.accessToken);
      if (data) {
        setUserDetails(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  };

  const authLogout = async () => {
    const token = getCookie("accessToken");
    if (token) {
      // await doLogout(token);
      setIsAuthenticated(false);
      setAuthData(null);
      setUserDetails(null); // Clear the user details on logout
      eraseCookie("accessToken");
      eraseCookie("expires");
    }
    toast.success("Đăng xuất thành công", { removeDelay: 2500 });
    navigate("/");
  };

  const getToken = () => getCookie("accessToken");

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        authData,
        userDetails,
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
