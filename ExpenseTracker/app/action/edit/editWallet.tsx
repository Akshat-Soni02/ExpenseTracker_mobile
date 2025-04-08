import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import LowerLimit from "@/components/inputs/LowerLimit";
import { useUpdateWalletMutation, Wallet } from "@/store/walletApi";
import { globalStyles } from "@/styles/globalStyles";

export type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Name?: error;
}

type LocalParams = {
  fetchedId: string;
  fetchedAmount: string;
  fetchedName: string;
  fetchedLowerLimit?: string;
}

type Data = {
  amount: number;
  lowerLimit?: number;
  Name: string;
}

export default function EditWalletScreen() {
  const router = useRouter();
  let { fetchedId, fetchedAmount, fetchedName, fetchedLowerLimit } = useLocalSearchParams() as LocalParams;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  let fetchedAmountNumber = Number(fetchedAmount);
  let fetchedLowerLimitNumber = Number(fetchedLowerLimit);

  const [updateWallet, {isLoading}] = useUpdateWalletMutation();
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      amount: fetchedAmountNumber,
      Name: fetchedName,
      lowerLimit: fetchedLowerLimitNumber,
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
      let dataObj: Partial<Wallet> = {};
      if(data.amount!==fetchedAmountNumber){
        dataObj.amount = data.amount;
      }
      if(data.lowerLimit!==fetchedLowerLimit){
        dataObj.lower_limit = Number(data.lowerLimit);
      }
      if(data.Name!==fetchedName){
        dataObj.wallet_title = data.Name;
      }
      const response = await updateWallet({id: fetchedId, body: dataObj}).unwrap();
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

  if(isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  return (
    <ScrollView style={globalStyles.viewContainer}>

      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>Edit Wallet</Text>
      </View>

      <AmountDescriptionInput control={control} label = "Name" onErrorsChange={setChildErrors}/>

      <LowerLimit control={control}/>

      <CustomButton onPress={handleSubmit(onWalletSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}