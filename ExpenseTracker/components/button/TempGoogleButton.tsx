import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from '@expo/vector-icons/AntDesign';

import { useGoogleLoginMutation, useAutoaddFriendsMutation } from "@/store/userApi";
import { useAuth } from "@/context/AuthProvider";

WebBrowser.maybeCompleteAuthSession();

const TempGoogleLoginButton = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [googleLogin, { isLoading: isLoadingGoogle, error: errorGoogle }] = useGoogleLoginMutation();
    const [autoAdd, {isLoading: isLoadingAutoFriends, error: errorAutoAddFriends}] = useAutoaddFriendsMutation();
    const { login } = useAuth();

    const config = {
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    };

    const [request, response, promptAsync] = Google.useAuthRequest(config);

    const getUserInfo = async (token: string | undefined) => {

        if (!token) return;

        try {
          const response = await fetch(
            process.env.EXPO_PUBLIC_GOOGLE_USERINFO_URL || "https://www.googleapis.com/userinfo/v2/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const user = await response.json();
          if (!user) {
            Alert.alert("Google sign-in failed", "Not able to fetch user data from google Account");
            return;
          }

          let res = await googleLogin({user});
          if(!res.data?.token) {
            Alert.alert("Google sign-in failed", "Token not received from server");
            return;
          }
          
          await login(res.data?.token);
          await AsyncStorage.setItem("user", JSON.stringify(res.data.userData));
          await autoAdd({email: res.data.userData.email}).unwrap();
          if(errorAutoAddFriends) {
            console.log("error auto adding friends", errorAutoAddFriends);
          }
          setUserInfo(user);
          router.push("/(tabs)");
        } catch (error) {
          console.error(
            "Failed to fetch user data:",
            response?.status,
            response?.statusText
          );
        }
      };

      const signInWithGoogle = async () => {
        try {
          const userJSON = await AsyncStorage.getItem("testUser");
      
          if (userJSON) {
            setUserInfo(JSON.parse(userJSON));
            router.push("/(tabs)");
          } else if (response?.type === "success") {
            // If no user information is found and the response type is "success" (assuming response is defined),
            getUserInfo(response.authentication?.accessToken);
          }
        } catch (error) {
          Alert.alert("Google sign-in failed", error?.message || "Not able to fetch user data from google Account");
          console.error("Error retrieving user data from AsyncStorage:", error);
        }
      };
      
      useEffect(() => {
        signInWithGoogle();
      }, [response]);

      console.log(userInfo);

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <AntDesign name="google" size={20} color="#4285F4" style={styles.googleIcon} />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    
    );
}

export default TempGoogleLoginButton;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    borderColor: "#dddddd",
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    minWidth: 300,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
});
