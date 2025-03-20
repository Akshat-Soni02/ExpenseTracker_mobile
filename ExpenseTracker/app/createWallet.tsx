import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import TitleInput from "@/components/TitleInput";
import AddPeopleInput from "@/components/AddPeopleInput";
import InitialBudget from "@/components/InitialBudget";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import LowerLimit from "@/components/LowerLimit";
import { useCreateWalletMutation } from "@/store/walletApi";

export default function CreateWalletScreen() {
  const [createWallet, {isLoading}] = useCreateWalletMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      amount: 0,
      title: "",
      lower_limit: 0
    },
  });

  const router = useRouter();

// amount, wallet_title, lower_limit

  const onWalletSubmit = async (data: any) => {
    try {
      console.log("Wallet Data:", data);
      const response = await createWallet({
        amount: data.amount,
        lower_limit: data.lowerLimit,
        wallet_title: data.Name
      }).unwrap();
      console.log("New wallet response: ", response);
      reset();
      router.replace("/(tabs)/wallets");
    } catch (error) {
      console.error("new wallet failed to create:", error);
        const err = error as { data?: { message?: string } };
        if (err?.data?.message) {
          setErrorMessage(err.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
    }
  };

  if(isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>New Wallet</Text>
      </View>

      {/* wallet Title and Amount */}
      <AmountDescriptionInput control={control} label = "Name"/>

      {/* lower limit */}
      <LowerLimit control={control}/>

      {/* Save Button */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <CustomButton onPress={handleSubmit(onWalletSubmit)} style={styles.button}>Save</CustomButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10
  },
  backButton: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  button: {
    marginVertical: 15,
    alignSelf: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  }
});