import { StyleSheet, Image } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/1.png")} style={styles.image} />
      <Text style={globalStyles.title}>Explore the app</Text>
      <Text style={styles.subtitle}>
        Now your finances are in one place and always under control
      </Text>

      <CustomButton style={styles.signInButton} onPress={() => router.push("/login")}>
  Sign In
</CustomButton>

<CustomButton
  style={styles.createAccountButton}
  variant="outline"
  onPress={() => router.push("/signup")}
>
  Create Account
</CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  signInButton: {
    width: "90%",
    marginBottom: 10,
  },
  createAccountButton: {
    width: "90%",
    backgroundColor: "white"
  },
});

