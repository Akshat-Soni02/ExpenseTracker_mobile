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
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Bill</Text>
      </View>

      {/* View Mode */}
      
          <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>
          <CategorySelector control={control}/>
          <PeriodSelector control={control}/>

      {errorMessage && (Alert.alert("Error",errorMessage))}
          <CustomButton onPress={handleSubmit(onSubmit)} style={styles.button}>Save</CustomButton>
    
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F5F7FA", 
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerButton: {
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 18,
    color: "#555",
    marginTop: 5,
  },
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
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  button: {
    marginVertical: 15,
    alignSelf: "center",
  },
});