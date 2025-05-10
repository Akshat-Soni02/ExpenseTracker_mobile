import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import * as ImagePicker from "expo-image-picker";
  import { LinearGradient } from "expo-linear-gradient";
  import { useLocalSearchParams } from "expo-router";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
  
  import { useUpdateUserDetailsMutation } from "@/store/userApi";
  import { globalStyles } from "@/styles/globalStyles";
  import Header from "@/components/Header";
  import CustomSnackBar from "@/components/CustomSnackBar";
  
  type UserData = {
    name: string;
    phone_number: string;
    daily_limit: string;
    profile_photo: string;
  }

  type EditProfileProps =  {
    name: string;
    phone_number?: string;
    daily_limit?: string;
    profile_photo: string;
  }
  
  const EditProfileScreen: React.FC<EditProfileProps> = () => {
  
    const { name, phone_number, daily_limit, profile_photo } = useLocalSearchParams() as EditProfileProps;
    const [userData, setUserData] = useState<UserData>({ name, phone_number: phone_number || "", daily_limit: daily_limit || "", profile_photo});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(false);
    const [updateUser, {isLoading}] = useUpdateUserDetailsMutation();

    useEffect(() => {
        setUserData({
            name,
            phone_number: phone_number || "",
            daily_limit: daily_limit || "0",
            profile_photo
        });
    }, [name, phone_number, daily_limit, profile_photo]);
  
    useEffect(() => {
      if (errorMessage) {
        Alert.alert("Error", errorMessage);
      }
    }, [errorMessage]);
  
    const handleSubmit = async () => {
        if (userData.phone_number !== "" && userData.phone_number.length !== 10) {
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
            setVisible(true);
        } catch (error) {
            console.error("Update failed:", error);
            const err = error as { data?: { message?: string } };
            if (err?.data?.message) {
            setErrorMessage(err.data.message);
            } else {
            setErrorMessage("Something went wrong. Please try again.");
            }
        }
    };
  
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
  
        <View style={globalStyles.viewContainer}>
  
          <Header headerText="Edit Profile"/>
          <View style={styles.profileSection}>
  
            <TouchableOpacity onPress={pickImage} activeOpacity={0.7} style = {{position: "relative"}}>
              {selectedImage || userData.profile_photo ? (
                <Image
                  source={{ uri: selectedImage || userData.profile_photo }}
                  style={styles.profileImage}
                />
              ) : (
                <LinearGradient colors={["#2C2C2C", "#555555"]} style={styles.profileImageContainer} />
              )}
              <MaterialCommunityIcons name="pencil-box" size={22} color="grey" style = {styles.imagePencil}/>
            </TouchableOpacity>
          </View>

            <View style={styles.card}>
    
                <View style={styles.phoneInputContainer}>
                    <TextInput
                        style={styles.inputName}
                        defaultValue={userData.name || ""}
                        placeholder={"Enter your name"}
                        placeholderTextColor="gray"
                        onChangeText={(text) => setUserData({ ...userData, name: text })}
                    />
                </View>
            </View>

  
          <View style={styles.card}>  
            <View style={styles.phoneInputContainer}>
                <Text style={styles.phonePrefix}>+91</Text>
                <TextInput
                    style={styles.phoneInput}
                    keyboardType="numeric"
                    maxLength={10}
                    defaultValue={userData?.phone_number?.toString() || ""}
                    value={userData.phone_number}
                    placeholder="Enter phone number"
                    onChangeText={(text) => {
                    const cleanedText = text.replace(/\D/g, "");
                    if (cleanedText.length <= 10) {
                        setUserData({ ...userData, phone_number: cleanedText });
                    }
                    }}
                />
            </View>
  
          </View>
  
          <View style={styles.card}>
            <View style = {styles.rupeeContainer}><Text style={[styles.rupee]}>₹</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={userData.daily_limit}
                    defaultValue={userData.daily_limit || ""}
                    placeholder={"Enter daily limit"}
                    onChangeText={(text) => setUserData({ ...userData, daily_limit: text })}
                />
            </View>
          </View>

          
  
          <TouchableOpacity style={styles.logoutButton} onPress={handleSubmit}>
            {isLoading ? (
            <ActivityIndicator color="#000" />
            ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>  
                <Text style={styles.logoutText}>Update</Text>
            </View>
            )}
        </TouchableOpacity>

        <CustomSnackBar
          message="Successfully updated"
          visible={visible}
          onDismiss={() => setVisible(false)}
        />

        </View>
      </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: "#F9FAFC",
    },
    profileSection: {
      alignItems: "center",
      marginTop: 10,
      marginBottom: 20,
      width: "100%",
    },
    profileImageContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "#E0E0E0",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    imagePencil: {
      position: "absolute",
      bottom: 6,
      right: 4,
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 2,
    },
    card: {
      backgroundColor: "#F0F0F5",
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 15,
    },
    inputName: {
      fontSize: 17,
      fontWeight: "400",
      color: "#1A1A1A",
      width: "100%",
    },
    phoneInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    phonePrefix: {
      fontSize: 17,
      fontWeight: "400",
      color: "#444",
      marginRight: 6,
    },
    phoneInput: {
      fontSize: 17,
      flex: 1,
      color: "#1A1A1A",
    },
    rupeeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    rupee: {
      fontSize: 18,
      color: "#444",
    },
    input: {
      fontSize: 17,
      color: "#1A1A1A",
      flex: 1,
    },
    logoutButton: {
      backgroundColor: "#111827",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      width: "80%",
      alignSelf: "center",
    },
    logoutText: {
      fontSize: 16,
      color: "#FFF",
      fontWeight: "600",
    },
  });
  
  
  export default EditProfileScreen;
  