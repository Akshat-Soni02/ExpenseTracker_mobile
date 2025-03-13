import {View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Dimensions, StyleSheet, Platform,TextInput} from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { useGetUserQuery } from "@/store/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogoutUserMutation,useUpdateUserDetailsMutation ,useUpdateUserProfilePhotoMutation} from "@/store/userApi";
const { width, height } = Dimensions.get("window");
import { useState } from "react";
//console.warn(height / 210);
const ProfileScreen = () => {


const router = useRouter();
const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation(); // Get the mutation function
const [updateUser] = useUpdateUserDetailsMutation();
const [isEditing, setIsEditing] = useState(false);
const [userData, setUserData] = useState({
    name: "",
    phone_number: "",
    daily_limit: "",
  });
// const [fontsLoaded, fontError] = useFonts({
//     HelvetIns: require("../../assets/fonts/HelvetIns.ttf"),
// });
  const {data: dataUser, isLoading: isLoadingUser, error: errorUser,refetch} = useGetUserQuery({});
  const handleLogout = async () => {
    try {
        await logoutUser().unwrap(); // Call the mutation and wait for it to complete
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("user");
        console.log("User logged out successfully");
        router.replace("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
  };
  
  React.useEffect(() => {
    if (dataUser?.data) {
      setUserData({
        name: dataUser.data.name,
        phone_number: dataUser.data.phone_number,
        daily_limit: dataUser.data.daily_limit,
      });
    }
  }, [dataUser]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes to database
      try {
        console.log(userData);
        await updateUser(userData).unwrap();
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
    setIsEditing(!isEditing);
    refetch();
  };
  if (isLoadingUser) {
    return <Text>Loading...</Text>;
  }
  
  if (errorUser) {
    return <Text>Error: {errorUser?.message || JSON.stringify(errorUser)}</Text>;
  }
return (
    <SafeAreaView style={styles.screen}>
    <View style={styles.screen}>
        <View style={styles.mainContainer}>
        <View style={styles.mainContainer2}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="black" />
          </TouchableOpacity> 
          <TouchableOpacity onPress={handleEditToggle} style={styles.headerText}>
            <FontAwesome name={isEditing ? "check" : "pencil"} size={30} color="black" />
          </TouchableOpacity>    
            <View style={styles.profilePhoto}>
            {/* avatar */}
            <View
                style={[styles.profilePhotoView,{ paddingTop: 10 }]}
            >
                <LinearGradient
                colors={["#4c669f", "#4c669f", "#FC7533"]}
                style={styles.profilePhotoGradient}
                >
                <Image
                    source={require("../assets/images/sampleprofilepic.png")}
                    style = {styles.profilePhotoCircle}
                    resizeMode="cover"
                />
                </LinearGradient>
            </View>
            {/* name */}
            <View style={styles.nameContainer}>
              {isEditing ? (
                <TextInput style={styles.nameText}  placeholder={dataUser?.data.name || "Enter your name"} placeholderTextColor="lightgray" onChangeText={(text) => setUserData({ ...userData, name: text })} />
              ) : (
                <Text style={styles.nameText}>{userData.name}</Text>
              )}
            </View>
            </View>

        {/* <View style={styles.designContainer}>
            <View style={styles.whiteCircle} />
            <LinearGradient
                colors={['#4c669f', '#4c669f', '#192f6a']} // Blue gradient
                style={styles.blueGradientCircle}
            />
            <LinearGradient
                colors={['#4c669f', '#4c669f', '#A0C4FF']} // Lighter blue gradient
                style={styles.lightBlueGradientCircle}
            />
        </View> */}

        <View style={styles.card}>
          <View style = {styles.infoContainer}>
          <Text style={styles.label}>Phone Number:</Text>
          {isEditing ? (
            <TextInput style={styles.value} keyboardType="numeric" value={userData.phone_number} placeholder={dataUser?.data.phone_number.toString() || "Enter your phone number"} placeholderTextColor="lightgray" onChangeText={(text) => setUserData({ ...userData, phone_number: text })} />
          ) : (
            <Text style={styles.value}>{userData.phone_number}</Text>
          )}
          </View>
        </View>
    <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email ID:</Text>
          <Text style={styles.value}>{dataUser.data.email}</Text>
        </View>
    </View>
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Daily Limit:</Text>
        {isEditing ? (
          <TextInput style={styles.value} keyboardType="numeric" value={userData.daily_limit} placeholder={dataUser?.data.daily_limit.toString() || "Enter daily limit"} placeholderTextColor="lightgray" onChangeText={(text) => setUserData({ ...userData, daily_limit: text })} />
        ) : (
          <Text style={styles.value}>{`₹${userData.daily_limit}`}</Text>
        )}
        </View>
      </View>
        <View style={styles.logoutContainer}>
            {/* Logout button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <View style={styles.buttonContent}>
                        <MaterialIcons name="logout" size={24} color="black" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

        </View>
    </View>
    </View>
    </SafeAreaView>
);
};
const styles = StyleSheet.create({
    screen: {
          flex: 1, // This makes the view take the full height and width of its parent
          backgroundColor: 'white', // This sets the background color to white
    },
    mainContainer: {
        flex: 1, // This makes the view take the full height and width of its parent
        backgroundColor: 'white', // This sets the background color to white
        position: 'relative', // This sets the position to relative
      },
      mainContainer2: {
        width: '100%', // This makes the view take the full width of its parent
        backgroundColor: 'white', // This sets the background color to white
        position: 'relative', // This sets the position to relative
      },backButton: {
        // position: "absolute",
        left: 10,
        top: 20, // Space above the back button
        marginBottom: 20, // Space below the back button
      },
      headerText: {
        position: "absolute",
        top: 20, // Space above the header text
        fontSize: 22,
        right: 10,
        fontWeight: "bold",
        marginBottom: 20, // Space below the header text
      },
      profilePhoto: {
        width: '100%', // This makes the view take the full width of its parent
        position: 'relative', // This sets the position to relative
        zIndex: 50, // This sets the z-index to 50
        alignItems:"center",
        justifyContent:"center",
      },
      profilePhotoView: {
        width: 200, // Define a width for the box
        backgroundColor: 'white', // Background color for visibility
        marginLeft: 'auto', // Auto margin for left
        marginRight: 'auto', // Auto margin for right
        padding: 20, // Padding for the content
      },
      profilePhotoGradient: {
        width: 144, // Equivalent to w-36 (36 * 4)
        height: 144, // Equivalent to h-36 (36 * 4)
        borderRadius: 72, // Equivalent to rounded-full (half of width/height)
        padding: 8, // Equivalent to p-2 (2 * 4)
        backgroundColor: 'lightblue', // Background color for visibility
        flexDirection: 'column', // Equivalent to flex-col
        alignItems: 'center', // Equivalent to items-center
        justifyContent: 'center', // Equivalent to justify-center
      },
      profilePhotoCircle: {
        width: 128, // Equivalent to w-32 (32 * 4)
        height: 128, // Equivalent to h-32 (32 * 4)
        borderRadius: 64, // Equivalent to rounded-full (half of width/height)
        backgroundColor: 'lightblue', // Background color for visibility
      },
      nameContainer: {
        width: '100%', // Equivalent to w-full
        marginLeft: 'auto', // Centering effect (optional, depending on layout)
        marginRight: 'auto', // Centering effect (optional, depending on layout)
        paddingTop: 16, // Equivalent to pt-4 (4 * 4)
        position: 'relative', // Equivalent to relative
      },
      nameText: {
        color: '#1F2937', // Equivalent to text-gray-800 (dark gray)
        fontSize: 24, // Equivalent to text-2xl (you can adjust this based on your design)
        textAlign: 'center', // Equivalent to text-center
      },
      input: { 
        fontSize: 18, 
        color: "#333", 
        borderBottomWidth: 1, 
        borderColor: "#999", 
        paddingBottom: 5, 
        marginBottom: 10 
      },

      designContainer: {
        position: 'relative',
        flex:0.5,
      },
      whiteCircle: {
        width: '100%',
        height: 500,
        position: 'absolute',
        left: 0,
        top: -52,
        backgroundColor: 'white',
        borderRadius: 250, // Half of height for a full circle
        zIndex: 30,
      },
      blueGradientCircle: {
        width: 550,
        height: 550,
        position: 'absolute',
        left: -10,
        top: -52,
        borderRadius: 275, // Half of height for a full circle
        zIndex: 20,
      },
      lightBlueGradientCircle: {
        width: 500,
        height: 470,
        position: 'absolute',
        right: 10,
        top: -40,
        borderRadius: 235, // Half of height for a full circle
        zIndex: 10,
      },
      card: {
        marginTop:20,
        backgroundColor: "rgba(200, 230, 255, 0.4)",
        borderRadius: 30,
        padding: 20,
        marginLeft:5,
        marginRight:5,
      },
      infoContainer: {
        flexDirection: 'row', // Align label and value in a row
        justifyContent: 'space-between', // Space between label and value
        marginBottom: 15,
      },
      label: {
        fontSize: 18,
        fontWeight: '600', // Bold for labels
        color: '#333',
      },
      value: {
        fontSize: 18,
        color: '#666', // Lighter color for the displayed values
      },
      logoutContainer: {
        justifyContent:"flex-end",
        width: '100%', // Equivalent to w-full
        height: '100%', // Equivalent to h-full
        paddingTop: 96, // Equivalent to pt-24 (24 * 4)
      },
      buttonContainer: {
        flex: 1, // Equivalent to flex-1
        backgroundColor: 'white', // Background color for the button container
      },
      logoutButton: {
        width: '100%', // Equivalent to w-full
        paddingVertical: 16, // Equivalent to py-4 (4 * 4)
      },
      buttonContent: {
        flexDirection: 'row', // Equivalent to flex-row
        alignItems: 'center', // Equivalent to items-center
        justifyContent: 'center', // Equivalent to justify-center
      },
      logoutText: {
        fontSize: 20, // Equivalent to text-xl
        color: '#4B5563', // Equivalent to text-gray-700
        paddingLeft: 8, // Equivalent to pl-2 (2 * 4)
      },
    clipPath: {
        width: 200,
        height: 200,
        backgroundColor: "blue",
        borderRadius: 100, // Tạo thành hình tròn
        overflow: "hidden", // Ẩn đi phần ngoài phạm vi borderRadius
    },
});
export default ProfileScreen;