import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useUpdateBudgetMutation, useGetBudgetQuery } from "@/store/budgetApi";
import { useLocalSearchParams } from "expo-router";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import CategorySelector from "@/components/CategorySelector";
import PeriodSelector from "@/components/PeriodSelector";
import { useForm } from "react-hook-form";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
export default function ViewBudgetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [updateBudget, { isLoading }] = useUpdateBudgetMutation();
  const { data: dataBudget, isLoading: isLoadingBudget, error: errorBudget, refetch } = useGetBudgetQuery(id);

//   const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      amount: dataBudget.data.amount,
      Description: dataBudget.data.budget_title,
      category: dataBudget.data.budget_category,
      period: dataBudget.data.period,
    },
  });

  // Reset form with default values when switching to edit mode
//   useEffect(() => {
//     if (isEditing && dataBudget) {
//       reset({
//         amount: dataBudget.data.amount.toString(), // Convert to string if necessary
//         Description: dataBudget.data.budget_title,
//         category: dataBudget.data.budget_category,
//         period: dataBudget.data.period,
//       });
//     }
//   }, [isEditing, dataBudget, reset]);

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
        childErrors.amount?.message,
        childErrors.Description?.message
      ].filter(Boolean).join("\n");
  
      Alert.alert("Invalid data", messages);
    }
  }, [childErrors]);

  const onSubmit = async (data: any) => {
      try {
        let dataObj: { amount?: number; budget_title?:string;budget_category?:string;period?:string} = {};
      if(data.amount!==dataBudget.data.amount){
        dataObj.amount =  parseFloat(data.amount);
      }
      if(data.Description!==dataBudget.data.budget_title){
        dataObj.budget_title = data.Description;
      }
      if(data.category!==dataBudget.data.budget_category){
        dataObj.budget_category= data.category;
      }
      if(data.period!==dataBudget.data.period){
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
        setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (isLoadingBudget) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (errorBudget) {
    return <Text style={styles.errorMessage}>Error: {errorBudget?.message || JSON.stringify(errorBudget)}</Text>;
  }

  return (
    <ScrollView style={globalStyles.viewContainer}>
      {/* Header */}
      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>Edit Budget</Text>
      </View>

      {/* View Mode */}
      
          <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>
          <CategorySelector control={control}/>
          <PeriodSelector control={control}/>

      {errorMessage && (Alert.alert("Error",errorMessage))}
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