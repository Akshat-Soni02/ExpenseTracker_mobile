import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputKeyPressEventData, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomButton from "../../components/button/CustomButton";
import { useVerifyOtpMutation, useSendOtpMutation } from "@/store/userApi";
import Header from "@/components/Header";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const {email} = useLocalSearchParams() as {email: string};

  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(20);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const [verifyOtp, {isLoading: loadinging}] = useVerifyOtpMutation();


  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (index: number, event: { nativeEvent: TextInputKeyPressEventData }) => {
    if (event.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async () => {
    setErrorMessage("");
    try {
      const otpString = otp[0]+otp[1]+otp[2]+otp[3];
      const response = await verifyOtp({email, otp:otpString}).unwrap();
      router.push({ pathname: "/auth/reset", params: { email } });
    } catch (error) {
      console.error("OTP failed to verify:", error);
      const err = error as { data?: { message?: string } };
      if (err?.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  const handleOtpResend = async () => {
    setErrorMessage("");
    try {
      const response = await sendOtp({ email }).unwrap();
      setTimer(20);
    } catch (error) {
      console.error("OTP failed to send:", error);
      const err = error as { data?: { message?: string } };
      if (err?.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Header />

      {/* Header */}
      <Text style={styles.header}>Please check your email</Text>
      <Text style={styles.subtext}>
        We've sent a code to <Text style={styles.emailText}>{email}</Text>
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
            onKeyPress={(event) => handleOtpKeyPress(index, event)}
          />
        ))}
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {/* Verify Button */}
      <CustomButton onPress={handleOtpSubmit} style={styles.verifyButton} disabled={loadinging}>
        {loadinging ? <ActivityIndicator color="#fff" /> : "Verify"}
      </CustomButton>

      {/* Resend Timer */}
      <TouchableOpacity
        disabled={timer > 0}
        onPress={handleOtpResend}
        style={styles.resendContainer}
      >
        <Text style={styles.resendText}>
        {isLoading ? (
          <Text>Sending...</Text>
        ) : (
          <Text>
            Send code again
            {timer > 0 ? `  00:${timer < 10 ? `0${timer}` : timer}` : ""}
          </Text>
        )}
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
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
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
    paddingHorizontal: 15
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