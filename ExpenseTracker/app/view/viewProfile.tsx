import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useGetUserQuery, useLogoutUserMutation} from "@/store/userApi";
import { useAuth } from "@/context/AuthProvider";
import api from "@/store/api";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";

const ProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const { logout, loading } = useAuth();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const { data: dataUser, isLoading: isLoadingUser, error: errorUser } = useGetUserQuery();

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      await logout();
      // await handleGoogleSignOut();
      await AsyncStorage.clear();
      dispatch(api.util.resetApiState());
    } catch (error) {
      console.error("Logout failed:", error);
      const err = error as { data?: { message?: string } };
      if (err?.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };
  

  if (isLoadingUser) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (errorUser) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorUser) {
      errorMessage = `Server Error: ${JSON.stringify(errorUser.data)}`;
    } else if ("message" in errorUser) {
      errorMessage = `Client Error: ${errorUser.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  return (
    <SafeAreaView style={styles.screen}>

      <View style={globalStyles.viewContainer}>

        <Header/>
        <View style={styles.profileSection}>

          <View>
            {dataUser?.data?.profile_photo ? (
              <Image
                source={{ uri: dataUser?.data.profile_photo?.url }}
                style={styles.profileImage}
              />
            ) : (
              <LinearGradient colors={["#2C2C2C", "#555555"]} style={styles.profileImageContainer} />
            )}
          </View>
          <Text style={styles.profileName}>{dataUser?.data.name}</Text>
          <Text style={styles.mail}>{dataUser?.data?.email}</Text>

        </View>

        <TouchableOpacity style = {styles.profileMenu} onPress={() => router.push({ pathname: "/action/edit/editProfile", params: {name: dataUser?.data.name, phone_number: dataUser?.data.phone_number?.toString(), daily_limit: dataUser?.data.daily_limit?.toString(), profile_photo: dataUser?.data.profile_photo?.url} })}>
          <View style = {styles.profileMenuDetail}>
            <Ionicons name="person-outline" size={20} color="black" />
            <Text style = {styles.profileDetailText}>Edit Profile</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#5b5b5b" />
        </TouchableOpacity>

        <TouchableOpacity style = {styles.profileMenu} onPress={() => router.push("/misc/privacyPolicy")}>
          <View style = {styles.profileMenuDetail}>
            <Ionicons name="document-lock-outline" size={22} color="black" />
            <Text style = {styles.profileDetailText}>Privacy Policy</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style = {styles.profileMenu} onPress={() => router.push("/misc/contactUs")}>
          <View style = {styles.profileMenuDetail}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
            <Text style = {styles.profileDetailText}>Contact Us</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style = {styles.profileMenu} onPress={() => Alert.alert("Logout", "Are you sure ?", [
              { text: "Cancel", style: "cancel" },
              { text: "Yes, Logout", onPress: () => handleLogout() },
            ])}>
          <View style = {styles.profileMenuDetail}>
            {(!loading && !isLoggingOut) ? (
              <>
                <Ionicons name="log-out-outline" size={24} color="#ef6d6d" />
                <Text style = {[styles.profileDetailText, {color: "#ef6d6d"}]}>Logout</Text>
              </>
            ) : (<Text>Logging out...</Text>)}
          </View>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
  },
  
  phonePrefix: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 5,
  },
  profileMenu: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15
    // paddingHorizontal: 2
  },
  profileMenuDetail: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center"
  },
  profileDetailText: {
    fontSize: 16,
    fontWeight: "400"
  },
  phoneInput: {
    fontSize: 16,
    flex: 1,
    color: "black",
  }, 
  profileSection: {
    alignItems: "center",
    // marginBottom: 10,
    width: "100%",          
    borderBottomWidth: 1,   
    borderBottomColor: "#eeeeee", 
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#1F2937",
    marginTop: 4
  },
  inputName: {
    fontSize: 20,
    fontWeight: "600",
    borderBottomWidth: 1,
    borderColor: "#888",
    textAlign: "center",
    width: "80%",
    color: "#333",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  mail: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 15
  },
  value: {
    fontSize: 18,
    color: "#222",
    fontWeight: "600",
    marginTop: 4,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#999",
    paddingBottom: 5,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#355C7D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  logoutText: {
    fontSize: 18,
    color: "#FFF",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
