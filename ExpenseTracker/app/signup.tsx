import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Icons for eye and Facebook
import CustomButton from "../components/button/CustomButton";
import { useRouter } from "expo-router";
import GoogleButton from "@/components/GoogleButton";

export default function SignUpScreen() {
    const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up</Text>

      {/* Email Field */}
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} placeholder="example@gmail.com" placeholderTextColor="#999" />

      {/* Password Field */}
      <Text style={styles.label}>Create a password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="must be 8 characters"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <FontAwesome name={passwordVisible ? "eye-slash" : "eye"} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Field */}
      <Text style={styles.label}>Confirm password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="repeat password"
          placeholderTextColor="#999"
          secureTextEntry={!confirmPasswordVisible}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
          <FontAwesome name={confirmPasswordVisible ? "eye-slash" : "eye"} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <CustomButton onPress={() => console.log("Signing Up")}
        style={styles.signUpButton}
        >Sign up</CustomButton>

      {/* OR Register with */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Login Buttons */}
        <View style = {styles.googleButton}>
          <GoogleButton/>
        </View>

      {/* Already have an account? Log in */}
      <Text style={styles.loginText}>
        Already have an account? <Text style={styles.loginLink} onPress={() => router.push("/login")}>Log in</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    marginBottom: 5,
  },
  signUpButton: {
    alignSelf: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 35,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
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
  loginText: {
    marginTop: 20,
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