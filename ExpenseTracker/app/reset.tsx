import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "../components/button/CustomButton";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={20} color="black" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Reset password</Text>
      <Text style={styles.subtext}>Please type something you'll remember</Text>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="must be 8 characters"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="repeat password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Reset Password Button */}
      <CustomButton onPress={() => router.push("/(tabs)")} style={styles.button}>
        Reset password
      </CustomButton>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.push("/login")} style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Log in</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingTop: 80
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
    marginTop: 40,
  },
  subtext: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  button: {
    marginTop: 20,
    alignSelf: "center",
  },
  loginContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#777",
  },
  loginLink: {
    fontWeight: "bold",
    color: "#000",
  },
});