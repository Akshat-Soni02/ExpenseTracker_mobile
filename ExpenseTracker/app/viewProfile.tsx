import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useGetUserQuery, useLogoutUserMutation, useUpdateUserDetailsMutation } from "@/store/userApi";
import { useAuth } from "@/context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGoogleSignOut } from "@/components/GoogleButton";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { useDispatch, UseDispatch } from "react-redux";
import api from "@/store/api";
const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [localLoading, setLocalLoading] = useState(false);
  const { logout, loading } = useAuth();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();
  const [updateUser, {isLoading}] = useUpdateUserDetailsMutation();
  const [isEditing, setIsEditing] = useState(false);
  const { data: dataUser, isLoading: isLoadingUser, error: errorUser, refetch } = useGetUserQuery({});
  const [userData, setUserData] = useState({ name: "", phone_number: "", daily_limit: ""});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("data",dataUser);
    if (dataUser?.data) {
      setUserData({
        name: dataUser.data.name,
        phone_number: dataUser.data.phone_number? dataUser.data.phone_number : "",
        daily_limit: dataUser.data.daily_limit ? dataUser.data.daily_limit : 0,
      });
    }
  }, [dataUser]);

  const handleLogout = async () => {
    setLocalLoading(true);
    try {
      await logoutUser().unwrap();
      await logout();
      await handleGoogleSignOut();
      await AsyncStorage.clear();
      dispatch(api.util.resetApiState());
      router.replace("/welcome");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      if (userData.phone_number.length !== 10) {
        Alert.alert("Invalid Phone Number", "Phone number must be exactly 10 digits.");
        return;
      }
  
      try {
        const formData = new FormData();
        if(userData.name.length !== 0) formData.append("name", userData.name);
        if(userData.phone_number.length !== 0) formData.append("phone_number", userData.phone_number);
        if(userData.daily_limit.length !== 0) formData.append("daily_limit", userData.daily_limit);
        if(selectedImage) {
          const fileExtension = selectedImage.split(".").pop();
          const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
  
          formData.append("media", {
            uri: selectedImage,
            type: mimeType,
            name: `user-media.${fileExtension}`,
          } as any);
        }
        const res = await updateUser(formData).unwrap();
        await AsyncStorage.setItem("user", JSON.stringify(res.data));
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
    setIsEditing(!isEditing);
    refetch();
  };
  

  if (localLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (errorUser) {
    return <Text style={styles.errorText}>Error: {errorUser?.message || JSON.stringify(errorUser)}</Text>;
  }

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to grant permission to access photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={22} color="black" />
          </TouchableOpacity>
          {isEditing ? (<Feather name="check" size={24} color="black" onPress={handleEditToggle}/>) : (<MaterialCommunityIcons name="account-edit-outline" size={30} color="black" onPress={handleEditToggle}/>)}
        </View>

        {/* Profile Image */}
        <View style={styles.profileSection}>
        <TouchableOpacity onPress={isEditing ? pickImage : null} activeOpacity={isEditing ? 0.7 : 1}>
          {selectedImage || dataUser?.data?.profile_photo ? (
            <Image
              source={{ uri: selectedImage || dataUser.data.profile_photo.url }}
              style={styles.profileImage}
            />
          ) : (
            <LinearGradient colors={["#2C2C2C", "#555555"]} style={styles.profileImageContainer} />
          )}
        </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={styles.inputName}
              defaultValue={dataUser?.data.name || ""}
              placeholder={"Enter your name"}
              placeholderTextColor="gray"
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
          ) : (
            <Text style={styles.profileName}>{userData.name}</Text>
          )}
        </View>

        {/* User Info Cards */}
        <View style={styles.card}>
          <Text style={styles.label}>Phone Number:</Text>
          {isEditing ? (
            <View style={styles.phoneInputContainer}>
              <Text style={styles.phonePrefix}>+91</Text>
              <TextInput
                style={styles.phoneInput}
                keyboardType="numeric"
                maxLength={10} // Ensures only 10 digits can be entered
                defaultValue={userData?.phone_number.toString() || ""}
                value={userData.phone_number}
                placeholder="Enter phone number"
                onChangeText={(text) => {
                  // Remove any non-digit characters
                  const cleanedText = text.replace(/\D/g, "");
                  // Limit input to 10 digits
                  if (cleanedText.length <= 10) {
                    setUserData({ ...userData, phone_number: cleanedText });
                  }
                }}
              />
            </View>
          ) : (
            <Text style={styles.value}>{userData.phone_number ? `+91 ${userData.phone_number}` : "-"}</Text>
          )}
        </View>


        <View style={styles.card}>
          <Text style={styles.label}>Email ID:</Text>
          <Text style={styles.value}>{dataUser?.data?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Daily Limit:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={userData.daily_limit}
              defaultValue={dataUser?.data.daily_limit.toString() || ""}
              placeholder={dataUser?.data.daily_limit.toString() || "Enter daily limit"}
              onChangeText={(text) => setUserData({ ...userData, daily_limit: text })}
            />
          ) : (
            <Text style={styles.value}>{`₹${userData.daily_limit}`}</Text>
          )}
        </View>

        {/* Logout Button */}
        {!isEditing && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>  
                <MaterialIcons name="logout" size={24} color="white" />
                <Text style={styles.logoutText}>Logout</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
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
  
  phoneInput: {
    fontSize: 16,
    flex: 1,
    color: "black",
  },  
  backButton: {
    padding: 10,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
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
