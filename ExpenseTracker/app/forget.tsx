import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "../components/button/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useSendOtpMutation } from "../store/userApi";


export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  // const {sendOtp , {isLoading}} = useSendOtpMutation();

  const handleSubmit = async () => {
    try {
      // const response = await sendOtp({email}).unwrap();
      // console.log("otp sent:", response);
      // router.push("/otp");
    } catch (error) {
      console.error("otp failed to send:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={20} color="black" />
        {/* <FontAwesomeIcon icon={faArrowLeft} size={24} color="black" /> */}
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Forgot password?</Text>
      <Text style={styles.subtext}>
        Don't worry! It happens. Please enter the email associated with your account.
      </Text>

      {/* Email Input */}
      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

        <View style = {styles.sendCodeView}>
            {/* <CustomButton onPress={() => handleSubmit()} style={styles.sendCodeButton}>
            Send code
        </CustomButton> */}
        </View>
      

      {/* Remember Password */}
      <Text style={styles.rememberText}>
        Remember password?{" "}
        <Text style={styles.loginLink} onPress={() => router.push("../login")}>
          Log in
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: "flex-start",
      paddingTop: 120,
      backgroundColor: "#fff",
    },
    backButton: {
      position: "absolute",
      top: 50,
      left: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      fontFamily: "Poppins_700Bold",
      marginBottom: 10,
    },
    subtext: {
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: "#666",
      marginBottom: 30,
    },
    label: {
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: "#333",
      marginBottom: 5,
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      marginBottom: 30,
    },
    sendCodeView: {
        width: "100%",
        marginTop: 10,
        alignSelf: "center",
    },
    sendCodeButton: {
    //   width: "100%", // Ensures button takes full width
    //   marginTop: 10, // Adds spacing above button
      alignSelf: "center"
    },
    rememberText: {
      marginTop: 40,
      fontSize: 14,
      fontFamily: "Poppins_400Regular",
      color: "#777",
      textAlign: "center",
    },
    loginLink: {
      color: "#355C7D",
      fontWeight: "bold",
    },
  });  