import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";

import { useUpdateBudgetMutation, useGetBudgetQuery, Budget } from "@/store/budgetApi";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import CategorySelector from "@/components/selectors/CategorySelector";
import PeriodSelector from "@/components/selectors/PeriodSelector";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";

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

export default function EditBudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as {id: string};
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  const [updateBudget, { isLoading }] = useUpdateBudgetMutation();
  const { data: dataBudget, isLoading: isLoadingBudget, error: errorBudget, refetch } = useGetBudgetQuery(id);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      amount: dataBudget?.data.amount || 0,
      Description: dataBudget?.data.budget_title || "",
      category: dataBudget?.data.budget_category,
      period: dataBudget?.data.period,
    },
  });

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
        childErrors.amount?.message,
        childErrors.Description?.message
      ].filter(Boolean).join("\n");
  
      Alert.alert("Invalid data", messages);
    }
  }, [childErrors]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);

  const onSubmit = async (data: Data) => {
      try {
        let dataObj: Partial<Budget> = {};
        if(data.amount!==dataBudget?.data.amount){
          dataObj.amount =  data.amount;
        }
        if(data.Description!==dataBudget?.data.budget_title){
          dataObj.budget_title = data.Description;
        }
        if(data.category!==dataBudget?.data.budget_category){
          dataObj.budget_category= data.category;
        }
        if(data.period!==dataBudget?.data.period){
          dataObj.period = data.period;
        }

        await updateBudget({
          id,
          body: dataObj,
        }).unwrap();
        router.back();
      } 
      catch (error) {
        console.error("Failed to update budget:", error);
        const err = error as { data?: { message?: string } };
        setErrorMessage(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (isLoadingBudget || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (errorBudget) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorBudget) {
      errorMessage = `Server Error: ${JSON.stringify(errorBudget.data)}`;
    } else if ("message" in errorBudget) {
      errorMessage = `Client Error: ${errorBudget.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  return (
    <ScrollView style={globalStyles.viewContainer}>

      <Header headerText="Edit Budget"/>
      
      <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>
      <CategorySelector control={control}/>
      <PeriodSelector control={control}/>
      <CustomButton onPress={handleSubmit(onSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  errorMessage: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});