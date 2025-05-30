import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestPermissionAndroid } from "@/app/(tabs)";
import { PermissionsAndroid } from "react-native";
// import useSMS from "@/app/misc/useSMS";
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
  // const { checkPermissions, requestReadSMSPermission } = useSMS();

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

  const checkAndRequestPermission = async () => {
    const hasNotificationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    console.log("Notification permission status:", hasNotificationPermission);
    if (!hasNotificationPermission) {
      await requestPermissionAndroid();
    }
    // const hasSMSPermission = await checkPermissions();
    // console.log("Receive sms permission status:", hasSMSPermission);
    // if (!hasSMSPermission) {
    //   await requestReadSMSPermission();
    // }
  };

  const login = async (token: string) => {
    console.log("Storing Token in AsyncStorage:", token);
    await AsyncStorage.setItem("AuthToken", JSON.stringify(token));
    setAuthToken(token);
    await checkAndRequestPermission();
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