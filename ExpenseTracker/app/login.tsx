import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import CustomButton from "../components/button/CustomButton";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import GoogleButton from "@/components/GoogleButton";


export default function LoginScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>
        Hi, Welcome! <Text style={styles.wave}>👋</Text>
      </Text>

      {/* Email Input */}
      <Text style={styles.label}>Email address</Text>
      <TextInput style={styles.emailInput} placeholder="Your email" placeholderTextColor="#999" />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
        />
        <TouchableOpacity style={styles.eyeIcon}>
          <FontAwesome name="eye" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Forgot Password - Now properly aligned below password */}
      <TouchableOpacity style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPassword} onPress={() => router.push("/forget")}>Forgot password?</Text>
      </TouchableOpacity>

      {/* Log In Button */}
      <CustomButton onPress={() => router.push("/(tabs)")}>Log in</CustomButton>

      {/* OR Section */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Login Button (Google) */}
      <GoogleButton/>

      {/* Sign Up Link */}
      <Text style={styles.signupText}>
        Don’t have an account? <Text style={styles.signupLink} onPress={() => router.push("/signup")}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures full-screen spread
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  wave: {
    fontSize: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    alignSelf: "flex-start",
    marginBottom: 5,
    color: "#333",
  },
  emailInput : {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 30
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end", // Aligns "Forgot password?" to the right
    marginTop: 5,
    marginBottom: 35,
  },
  forgotPassword: {
    color: "#355C7D",
    fontFamily: "Poppins_400Regular",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginTop: 30,
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#777",
  },
  googleButton: {
    borderColor: "#DB4437", // Keeps border from outlined prop
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Makes button full-width
    height: 50,
    marginBottom: 20,
  },
  googleText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    marginLeft: 8, // Space between icon and text
    // color: "#DB4437",
  },
  signupText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#777",
  },
  signupLink: {
    color: "#355C7D",
    fontWeight: "bold",
  },
});