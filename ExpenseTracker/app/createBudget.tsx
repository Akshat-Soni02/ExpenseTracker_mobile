import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
// import SplitWithSelector from "@/components/SplitWithSelector";
// import NotesInput from "@/components/NotesInput";
// import WalletSelector from "@/components/WalletSelector";
// import PhotoSelector from "@/components/PhotoSelector";
// import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CategorySelector from "@/components/CategorySelector";
import PeriodSelector from "@/components/PeriodSelector";
import { useCreateBudgetMutation } from "@/store/budgetApi";

export default function AddBudgetScreen() {
  const [createBudget, {isLoading}] = useCreateBudgetMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount: null,
      budget_title: "",
      budget_category: "",
      period:"monthly",
    },
  });
  
  const router = useRouter();
  const amount = watch("amount");

  const TOLERANCE = 0.1;


  // description,
  // lenders,
  // borrowers,
  // wallet_id,
  // total_amount,
  // expense_category,
  // notes,
  // group_id,
  // created_at_date_time,
const onSubmit = async (data: any) => {

  try {

    
    console.log("Budget Data:", data.Description);
    const response = await createBudget({
      budget_title: data.Description,
      amount: data.amount,
      budget_category: data?.category,
      period:data?.period,
    }).unwrap();
    console.log("adding new budget response:", response);
    reset();
    router.replace("/(tabs)/activity/budgets");
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


  return (
    <ScrollView style={styles.container}>

        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>New Budget</Text>
      </View>

      <AmountDescriptionInput control={control} label="Description"/>

      <CategorySelector control={control} />
      <PeriodSelector control={control}/>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <CustomButton onPress={handleSubmit(onSubmit)} style={styles.button}>Save</CustomButton>
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
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 20
  },
  backButton: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  walletPhotoContainer: {
    flexDirection: "row",
    // gap: 1,
    width: "100%",
    height: 130,
    justifyContent: "space-between"
  },
  dateTimeContainer: {
    flexDirection: "row",
    // gap: 1,
    width: "100%",
    height: 100,
    justifyContent: "space-between"
  },
  button: {
    marginVertical: 15,
    alignSelf: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  }
});