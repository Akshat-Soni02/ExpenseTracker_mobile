import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

import CustomButton from "../../components/button/CustomButton";
import { useSendOtpMutation } from "@/store/userApi";
import Header from "@/components/Header";

type Data = {
  email: string;
}

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "yourmail@gmail.com",
    },
  });

  const onSubmit = async (data: Data) => {
    setErrorMessage("");
    try {
      const response = await sendOtp({ email: data.email }).unwrap();
      router.push({ pathname: "/auth/otp", params: { email: data.email } });
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

      <Header/>

      <Text style={styles.header}>Forgot password?</Text>
      <Text style={styles.subtext}>
        Don't worry! It happens. Please enter the email associated with your account.
      </Text>

      <Text style={styles.label}>Email address</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Enter a valid email",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#999"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />

      {typeof errors.email?.message === "string" && (
        <Text style={styles.error}>{errors.email.message}</Text>
      )}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {/* Submit Button */}
      <View style={styles.sendCodeView}>
        <CustomButton
          onPress={handleSubmit(onSubmit)}
          style={styles.sendCodeButton}
          disabled={isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : "Send code"}
        </CustomButton>
      </View>

      {/* Remember Password */}
      <Text style={styles.rememberText}>
        Remember password?{" "}
        <Text style={styles.loginLink} onPress={() => router.push("/auth/login")}>
          Log in
        </Text>
      </Text>
    </View>
  );
}

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
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  sendCodeView: {
    width: "100%",
    marginTop: 10,
    alignSelf: "center",
  },
  sendCodeButton: {
    alignSelf: "center",
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