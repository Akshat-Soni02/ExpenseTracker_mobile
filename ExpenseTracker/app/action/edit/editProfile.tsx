import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert,
    Animated,
    Easing
  } from "react-native";
  import React, { useState, useEffect, useRef } from "react";
  import * as ImagePicker from "expo-image-picker";
  import { LinearGradient } from "expo-linear-gradient";
  import { useLocalSearchParams } from "expo-router";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
  import { useToast } from "@/context/ToastContext";
  import { useAuth } from "@/context/AuthProvider";
  
  import { useUpdateUserDetailsMutation, useLazyGetPhoneNumAvailStatusQuery, useFirstMergeToDummyMutation } from "@/store/userApi";
  import { globalStyles } from "@/styles/globalStyles";
  import Header from "@/components/Header";
  import CustomSnackBar from "@/components/CustomSnackBar";
  import { saveItem } from "@/app/utils/storage";
  import { OTPWidget } from "@msg91comm/sendotp-react-native";

  import auth from '@react-native-firebase/auth'

  const widgetId = "35676b666963373539323436";
  const tokenAuth = "459774T79Mx5n7pf4R6870b007P1";
  
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
    const [performMergeWithDummy, setPerformMergeWithDummy] = useState<boolean>(false);
    const [updateUser, {isLoading}] = useUpdateUserDetailsMutation();
    const { showToast } = useToast();
    const { hasVerifiedPhoneNumber , setHasVerifiedPhoneNumber, setAuthToken } = useAuth();

    const [checkPhoneNumAvail, { data: dataNumCheck, isLoading: loadingNumCheck, error: errorNumCheck, isError: hasErrorNumCheck}] = useLazyGetPhoneNumAvailStatusQuery();
    const [firstMergeToDummy, { isLoading: loadingMergeDummy, error: errorMergeToDummy }] = useFirstMergeToDummyMutation();

    const [mode, setMode] = useState<"SEND" | "VERIFY">("SEND");
    const [otp, setOtp] = useState("");

    const [confirmation, setConfirmation] = useState(null);
    // const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [reqId, setReqId] = useState("");
    const flipAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      OTPWidget.initializeWidget(widgetId, tokenAuth);
    }, []);

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

    const handleSendOtp = async () => {
      const data = {
        identifier: `91${userData.phone_number}`,
      };
      const response = await OTPWidget.sendOTP(data);
      console.log(response);
      if (response.type === "success") {
        showToast({
          title: `OTP Sent`,
          type: "success",
        });
        setReqId(response.message);
        setMode("VERIFY");
        flipAnimation();
      } else {
        showToast({
          title: `Service down, Please try later`,
          type: "warning",
        });
      }
    }

    const handleNumChange = async () => {
      if (userData.phone_number !== "" && userData.phone_number.length !== 10) {
        Alert.alert("Invalid Phone Number", "Phone number must be exactly 10 digits.");
        return;
      }

      try {
        const { data } = await checkPhoneNumAvail({ phone_num: userData.phone_number }).unwrap();

        /**
         * since the phone num is
         * acquired, and its a dummy account otherwise
         * it would have thrown error
         */
        if(data.isPhoneNumAcquired) {
          /**
           * Asking for permission if user already has 
           * registered phone number and is now changing it
           */
          if(hasVerifiedPhoneNumber) {

            const proceed = await new Promise((resolve) => {
              Alert.alert(
                "Warning",
                "The phone number you are trying to update to is already associated with another account. If you proceed, you will lose all data (including friends) associated with the new number. Alternatively, you can create a new account to claim the data associated with the new number. Do you want to proceed?",
                [
                  { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                  { text: "Proceed", onPress: () => resolve(true) },
                ]
              );
            });
    
            if (!proceed) return;
          }

          setPerformMergeWithDummy(true);
        }
        await handleSendOtp();
      } catch (error) {
        showToast({
          title: `${error.data.message || "Server Error"}`,
          type: "error",
        });
      }
    };
  
    /**
     * if verification is success,
     * we check for merge status and merge with 
     * dummy account
     * 
     * Since currently we are not allowing user to change
     * their number once verfied (due to sms cost) we just have
     * simple boolean state of merge but later we should have phases
     * of whether we need to perform first merge or user already has number
     * in which case we loose new dummy data instead
     */
    const handleVerifyOtp = async () => {
      const body = {
        reqId,
        otp,
      };
      console.log(body);
      const response = await OTPWidget.verifyOTP(body);
      console.log(response);
      if (response.type === "success") {
        setHasVerifiedPhoneNumber(true);
        showToast({
          title: `OTP Verified`,
          type: "success",
        });
        setMode("SEND");
        flipAnimation();

        if(performMergeWithDummy) {
          try {
            const res = await firstMergeToDummy({ phone_num: userData.phone_number });
            if(res.data.userData) {
              await saveItem("user", res.data.userData);
              await saveItem("AuthToken", res.data.token);
              setAuthToken(JSON.stringify(res.data.token));
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          handleSubmit();
        }
      } else {
        showToast({
          title: `Invalid OTP`,
          type: "warning",
        });
      }
    };

    /**
     * These are the firebase alternative 
     * functions which allow around 150 free
     * OTPs in india and cost less after that
     * but requires billing account on firebase
     */
    // const firebaseSendOTP = async () => {
    //   try {
    //     const confirmationResult = await auth().signInWithPhoneNumber(`+91${userData.phone_number}`);
    //     setConfirmation(confirmationResult);
    //     setMode("VERIFY");
    //     flipAnimation();
    //   } catch (error) {
    //     console.error('Error sending OTP:', error);
    //   }
    // };

    // const firebaseConfirmOTP = async () => {
    //   try {
    //     const userCredential = await confirmation.confirm(otp);
    //     const user = userCredential.user;
    //     console.log('Verified phone:', user.phoneNumber);
    //     setMode("SEND");
    //     flipAnimation();
    //     // User is now logged in — can proceed to your app
    //   } catch (error) {
    //     console.error('Invalid OTP:', error);
    //   }
    // };
  
    const flipAnimation = () => {
      Animated.timing(flipAnim, {
        toValue: mode === "SEND" ? 1 : 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    };
  
    const handleSubmit = async () => {
      try {
        const formData = new FormData();
        if (userData.name.length !== 0) formData.append("name", userData.name);
        if (userData.phone_number.length !== 0) formData.append("phone_number", userData.phone_number);
        if (userData.daily_limit.length !== 0) formData.append("daily_limit", userData.daily_limit);
        if (selectedImage) {
          const fileExtension = selectedImage.split(".").pop();
          const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
  
          formData.append("media", {
            uri: selectedImage,
            type: mimeType,
            name: `user-media.${fileExtension}`,
          } as any);
        }
        const res = await updateUser(formData).unwrap();
        showToast({
          title: `${res.message}`,
          type: "success",
        });
        await saveItem("user", res.data);
        setVisible(true);
      } catch (error) {
        showToast({
          title: `${error.data.message}`,
          type: "error",
        });
      }
    };
  
    const frontInterpolate = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"],
    });
  
    const backInterpolate = flipAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["180deg", "360deg"],
    });
  
    const frontStyle = {
      transform: [{ rotateX: frontInterpolate }],
    };
    
    const backStyle = {
      transform: [{ rotateX: backInterpolate }],
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

    if(loadingMergeDummy) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  
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

  
            <Animated.View style={[styles.card, frontStyle]}>
              {mode === "SEND" && (
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.phonePrefix}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    keyboardType="numeric"
                    maxLength={10}
                    defaultValue={userData?.phone_number?.toString() || ""}
                    value={userData.phone_number}
                    editable={!hasVerifiedPhoneNumber}
                    placeholder="Enter phone number"
                    onChangeText={(text) => {
                      const cleanedText = text.replace(/\D/g, "");
                      if (cleanedText.length <= 10) {
                        setUserData({ ...userData, phone_number: cleanedText });
                      }
                    }}
                  />
                  {!hasVerifiedPhoneNumber && (
                    <TouchableOpacity style={styles.sendOtpButton} onPress={handleNumChange}>
                      <Text style={styles.sendOtpText}>Send OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Animated.View>

            <Animated.View style={[styles.card,{marginTop: -15}, backStyle]}>
              {mode === "VERIFY" && (
                <View style={styles.phoneInputContainer}>
                  <TextInput
                    style={styles.phoneInput}
                    keyboardType="numeric"
                    maxLength={6}
                    value={otp}
                    placeholder="Enter OTP"
                    onChangeText={(text) => setOtp(text)}
                  />
                  <TouchableOpacity style={styles.verifyOtpButton} onPress={handleVerifyOtp}>
                    <Text style={styles.verifyOtpText}>Verify OTP</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          <Text style={styles.infoText}>Valid phone number allows others to add you as a friend</Text>
  
          {/* removed the daily limit for now, don't see much usability - include later if needed */}
          {/* <View style={styles.card}>
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
          </View> */}

          
  
          <TouchableOpacity
            style={[styles.logoutButton, { opacity: hasVerifiedPhoneNumber ? 1 : 0.5 }]}
            onPress={hasVerifiedPhoneNumber ? handleSubmit : null}
            disabled={!hasVerifiedPhoneNumber}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.logoutText}>Update</Text>
              </View>
            )}
          </TouchableOpacity>

        {/* <CustomSnackBar
          message="Successfully updated"
          visible={visible}
          onDismiss={() => setVisible(false)}
        /> */}

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
      backfaceVisibility: "hidden", // Ensures proper flipping
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
    infoText: {
      fontSize: 14,
      color: "#6B7280", // Neutral gray for informational text
      textAlign: "center",
      marginTop: 10,
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
    sendOtpButton: {
      backgroundColor: "#111827",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    sendOtpText: {
      color: "#FFF",
      fontWeight: "600",
    },
    verifyOtpButton: {
      backgroundColor: "#111827",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    verifyOtpText: {
      color: "#FFF",
      fontWeight: "600",
    },
  });
  
  
  export default EditProfileScreen;
  