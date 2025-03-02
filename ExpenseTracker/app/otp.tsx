import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../components/button/CustomButton";
import { FontAwesome } from "@expo/vector-icons";

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(20);
  const inputRefs = useRef([]);

  const router = useRouter();

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (index, key) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={20} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Please check your email</Text>
      <Text style={styles.subtext}>
        We've sent a code to <Text style={styles.emailText}>helloworld@gmail.com</Text>
      </Text>

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
            onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
          />
        ))}
      </View>

      {/* Verify Button */}
      <CustomButton onPress={() => router.push("/reset")} style={styles.verifyButton}>
        Verify
      </CustomButton>

      {/* Resend Timer */}
      <TouchableOpacity
        disabled={timer > 0}
        onPress={() => setTimer(20)}
        style={styles.resendContainer}
      >
        <Text style={styles.resendText}>
          Send code again {timer > 0 ? `  00:${timer < 10 ? `0${timer}` : timer}` : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    paddingTop: 80,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    marginBottom: 10,
    marginTop: 40
  },
  subtext: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    marginBottom: 20,
  },
  emailText: {
    fontWeight: "bold",
    color: "#000",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    marginTop: 15,
    paddingInline: 15
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  verifyButton: {
    marginTop: 10,
    alignSelf: "center"
  },
  resendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#777",
  },
});
