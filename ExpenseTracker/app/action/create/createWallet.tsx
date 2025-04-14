import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,Alert } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import LowerLimit from "@/components/inputs/LowerLimit";
import { useCreateWalletMutation } from "@/store/walletApi";
import { globalStyles } from "@/styles/globalStyles";

export type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Name?: error;
}

type Data = {
  amount: number;
  lowerLimit?: number;
  Name: string;
}

export default function CreateWalletScreen() {
  const router = useRouter();

  const [createWallet, {isLoading}] = useCreateWalletMutation();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      amount: 0,
      Name: "",
      lowerLimit: undefined,
    },
  });


  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
        childErrors.amount?.message,
        childErrors.Name?.message
      ].filter(Boolean).join("\n");
  
      Alert.alert("Invalid data", messages);
    }
  }, [childErrors]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);

  const onWalletSubmit = async (data: Data) => {
    try {
      const response = await createWallet({
        amount: data.amount,
        lower_limit: data.lowerLimit,
        wallet_title: data.Name
      }).unwrap();
      reset();
      router.replace({ pathname: "/view/viewWallet", params: { id:response?.data?._id} });
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
    <ScrollView style={globalStyles.viewContainer}>
      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>New Wallet</Text>
      </View>

      {/* wallet Title and Amount */}
      <AmountDescriptionInput control={control} label = "Name" onErrorsChange={setChildErrors}/>

      {/* lower limit */}
      <LowerLimit control={control}/>

      {/* Save Button */}
      <CustomButton onPress={handleSubmit(onWalletSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}