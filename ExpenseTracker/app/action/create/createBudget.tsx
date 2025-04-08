import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
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
import { globalStyles } from "@/styles/globalStyles";
export default function AddBudgetScreen() {
  const [createBudget, {isLoading}] = useCreateBudgetMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});
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

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
        childErrors.amount?.message,
        childErrors.Description?.message
      ].filter(Boolean).join("\n");
  
      Alert.alert("Invalid data", messages);
    }
  }, [childErrors]);

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

      <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>
      {/* <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} IncludePaidBy/> */}
      {/* <NotesInput control={control} name="notes" /> */}

      {/* <View style={styles.walletPhotoContainer}> */}
        {/* <WalletSelector control={control} name="wallet"/> */}
        {/* <PhotoSelector control={control} /> */}
      {/* </View> */}

      <CategorySelector control={control} />
      <PeriodSelector control={control}/>
      {/* <View style={styles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date"/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View> */}
      
      {errorMessage && (Alert.alert("Error",errorMessage))}
      <CustomButton onPress={handleSubmit(onSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}