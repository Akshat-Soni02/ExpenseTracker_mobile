import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import CategorySelector from "@/components/selectors/CategorySelector";
import PeriodSelector from "@/components/selectors/PeriodSelector";
import { useCreateBudgetMutation } from "@/store/budgetApi";
import { globalStyles } from "@/styles/globalStyles";


type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Description?: error;
}

type Data = {
  amount: number;
  Description: string;
  category?: string;
  period?: string;
}

export default function AddBudgetScreen() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});
  const [validInput, setValidInput] = useState<boolean>(true);

  const [createBudget, {isLoading, error: errorBudget}] = useCreateBudgetMutation();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount: 0,
      Description: "",
      category: "",
      period:"monthly",
    },
  });
  
  const router = useRouter();

  // useEffect(() => {
  //   if (Object.keys(childErrors).length !== 0) {
  //     const messages = [
  //       childErrors.amount?.message,
  //       childErrors.Description?.message
  //     ].filter(Boolean).join("\n");
  
  //     Alert.alert("Invalid data", messages);
  //   }
  // }, [childErrors]);

    useEffect(() => {
      if (Object.keys(childErrors).length !== 0) {
        setValidInput(false);
      } else setValidInput(true);
    }, [childErrors]);
  
  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);


  const onSubmit = async (data: Data) => {
    try {
      const response = await createBudget({
        budget_title: data.Description,
        amount: data.amount,
        budget_category: data?.category,
        period:data?.period,
      }).unwrap();
      reset();
      router.replace({ pathname: "/view/viewBudget", params: { id:response?.data?._id} });
    } catch (error) {
      console.error("new budget failed to create:", error);
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
        <Text style={globalStyles.headerText}>New Budget</Text>
      </View>

      <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors} childErrors={childErrors}/>

      <CategorySelector control={control} />
      <PeriodSelector control={control}/>
      
      <CustomButton onPress={handleSubmit(onSubmit)} style={globalStyles.saveButton} disabled={!validInput}>Save</CustomButton>
    </ScrollView>
  );
}