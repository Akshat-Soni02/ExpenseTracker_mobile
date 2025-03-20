import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "../components/button/CustomButton";
import { useRouter } from "expo-router";
import GoogleButton from "@/components/GoogleButton";
import { useRegisterUserMutation } from "@/store/userApi";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      console.log("Form Data:", data);
      const response = await registerUser({
        email: data.email,
        password: data.confirmPassword,
      });
      console.log("RTK Query Response:", response);
      if (response?.error) {
        console.error("Registration failed:", response.error);
        return;
      }
      if (response?.data?.token) {
        await AsyncStorage.setItem("authToken", response.data.token);
        router.push("/(tabs)");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up</Text>
      <View style = {styles.form}>
      {/* Email Field */}
      <View>
      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Enter a valid email",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="example@gmail.com"
            placeholderTextColor="#999"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {typeof errors.email?.message === "string" && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}
      </View>


      {/* Password Field */}
      <View>
      <Text style={styles.label}>Create a password</Text>
      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="must be 8 characters"
              placeholderTextColor="#999"
              secureTextEntry={!passwordVisible}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
          <FontAwesome name={passwordVisible ? "eye-slash" : "eye"} size={20} color="#999" />
        </TouchableOpacity>
      </View>
      {typeof errors.password?.message === "string" && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}
      </View>

      {/* Confirm Password Field */}
      <View>
      <Text style={styles.label}>Confirm password</Text>
      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === control._formValues.password || "Passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="repeat password"
              placeholderTextColor="#999"
              secureTextEntry={!confirmPasswordVisible}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
          <FontAwesome name={confirmPasswordVisible ? "eye-slash" : "eye"} size={20} color="#999" />
        </TouchableOpacity>
      </View>
      {typeof errors.confirmPassword?.message === "string" && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}
      </View>

      {/* Sign Up Button */}
      <CustomButton onPress={handleSubmit(onSubmit)} style={styles.signUpButton}>
        {isLoading ? <ActivityIndicator color="#fff" /> : "Sign up"}
      </CustomButton>

      </View>

      {/* OR Register with */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Login Buttons */}
      <View style={styles.googleButton}>
        <GoogleButton />
      </View>

      {/* Already have an account? Log in */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.loginLink} onPress={() => router.push("/login")}>
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
  form: {
    gap: 35
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    // marginBottom: 35,
  },
  inputError: {
    borderColor: "red",
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
  errorText: {
    color: "red",
    fontSize: 12,
    // marginBottom: 10,
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