import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  authToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("AuthToken");
        console.log("Loaded Token from AsyncStorage:", token);
        setAuthToken(token);
      } catch (error) {
        console.error("Error loading AuthToken:", error);
      }
      setLoading(false);
    };

    loadToken();
  }, []);

  const login = async (token: string) => {
    console.log("Storing Token in AsyncStorage:", token);
    await AsyncStorage.setItem("AuthToken", token);
    setAuthToken(token);
  };

  const logout = async () => {
    console.log("Removing Token from AsyncStorage");
    await AsyncStorage.removeItem("AuthToken");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};