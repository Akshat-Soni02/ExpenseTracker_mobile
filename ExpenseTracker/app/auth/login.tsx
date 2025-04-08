import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomButton from "../../components/button/CustomButton";
import GoogleButton from "@/components/button/GoogleButton";
import { useLoginUserMutation } from "@/store/userApi";
import { useAuth } from "@/context/AuthProvider";

type Data = {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const { authToken, loading, login } = useAuth();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  

  useEffect(() => {
    if (!loading && authToken) {
      router.replace("/(tabs)");
    }
  }, [authToken, loading]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: Data) => {
    try {
      const response = await loginUser(data).unwrap();
      await login(response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.userData));
      router.push("/(tabs)");
    } catch (error) {
      console.error("Login failed:", error);
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
      <Text style={styles.header}>
        Hi, Welcome! <Text style={styles.wave}>👋</Text>
      </Text>

      {/* Email Input */}
      <View style={styles.formInput}>
        <Text style={styles.label}>Email address</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      </View>

      {/* Password Input */}
      <View style={styles.formInput}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => router.push("/auth/forget")}>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {/* Log In Button */}
      <CustomButton onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : "Log in"}
      </CustomButton>

      {/* OR Section */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Login Button (Google) */}
      <GoogleButton />

      {/* Sign Up Link */}
      <Text style={styles.signupText}>
        Don’t have an account?{" "}
        <Text style={styles.signupLink} onPress={() => router.push("/auth/signup")}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
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
  signupText: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#777",
  },
  signupLink: {
    color: "#355C7D",
    fontWeight: "bold",
  },
  formInput: {
    width: "100%",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    fontFamily: "Poppins_400Regular",
  },
});