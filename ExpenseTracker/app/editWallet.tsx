import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import TitleInput from "@/components/TitleInput";
import AddPeopleInput from "@/components/AddPeopleInput";
import InitialBudget from "@/components/InitialBudget";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import LowerLimit from "@/components/LowerLimit";
import { useUpdateWalletMutation } from "@/store/walletApi";

export default function CreateWalletScreen() {
  let {fetchedId, fetchedAmount, fetchedName, fetchedLowerLimit} = useLocalSearchParams();
  console.log(fetchedName,fetchedLowerLimit);
  const [updateWallet, {isLoading}] = useUpdateWalletMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      amount: fetchedAmount,
      Name: fetchedName,
      lowerLimit: fetchedLowerLimit,
    },
  });

  const router = useRouter();

// amount, wallet_title, lower_limit

  const onWalletSubmit = async (data: any) => {
    try {
      console.log("Wallet Data:", data);
      let dataObj: { amount?: number; lower_limit?: number; wallet_title?: string } = {};
      if(data.amount!==fetchedAmount){
        console.log("Hereamount");
        dataObj.amount = data.amount;
      }
      if(data.lowerLimit!==fetchedLowerLimit){
        console.log("HereLowerLimit");
        dataObj.lower_limit = data.lowerLimit;
      }
      if(data.Name!==fetchedName){
        console.log("HereName");
        dataObj.wallet_title = data.Name;
      }
      console.log(dataObj);
      const response = await updateWallet({id:fetchedId,body:dataObj}).unwrap();
      console.log("pdate wallet response: ", response);
      reset();
      router.back();
    } catch (error) {
      console.error("wallet failed to update:", error);
        const err = error as { data?: { message?: string } };
        if (err?.data?.message) {
          setErrorMessage(err.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
    }
  };

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
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
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