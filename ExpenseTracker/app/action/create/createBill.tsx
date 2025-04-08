import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import TitleInput from "@/components/TitleInput";
import AddPeopleInput from "@/components/AddPeopleInput";
import InitialBudget from "@/components/InitialBudget";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import CategorySelector from "@/components/CategorySelector";
import ToggleSwitch from "@/components/ToggleSwitch";
import SplitWithSelector from "@/components/SplitWithSelector";
import { useCreateBillMutation } from "@/store/billApi";
import { globalStyles } from "@/styles/globalStyles";
export default function CreateBillScreen() {
  const [createBill, {isLoading}] = useCreateBillMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});
  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      amount: 0,
      title: "",
      splitWith: [{ user_id: "1", amount: 0 }],
      members: [],
      date: new Date(),
      time: new Date(new Date().setHours(0, 0, 0, 0)),
      category: "",
      recurring: false
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
        childErrors.amount?.message,
        childErrors.Title?.message
      ].filter(Boolean).join("\n");
  
      Alert.alert("Invalid data", messages);
    }
  }, [childErrors]);

//   bill_title, amount, bill_category, due_date_time, recurring, members
  const onBillSubmit = async (data: any) => {
    try {
      const selectedDate = new Date(data.date);
      const selectedTime = new Date(data.time);

      const due_date_time = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes(),
          selectedTime.getSeconds()
      );
      let members = [];
      data?.splitWith.forEach((split) => {
        members.push({user_id: split.user_id, amount: split.amount, status: "pending"})
      });

      const response = await createBill({
        bill_title: data?.Title,
        amount: data?.amount,
        bill_category: data?.category,
        due_date_time,
        recurring: data?.recurring,
        members
      }).unwrap();
      reset();
      router.replace({ pathname: "/view/viewBill", params: { id:response?.data?._id} });
    } catch (error) {
      console.error("new bill failed to create:", error);
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>New Bill</Text>
      </View>

      {/* Bill Title and amount */}
      <AmountDescriptionInput control={control} label = "Title" onErrorsChange={setChildErrors}/>

      {/* Add Members to share */}
      {/* <AddPeopleInput control={control} /> */}
      <SplitWithSelector control={control} setValue={setValue} amount={watch("amount")} title="Share with"/>

      {/* Initial Budget & Date */}
      <View style={globalStyles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Due Date"/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Due Time" useDefaultToday/>
      </View>
      <CategorySelector control={control}/>
      <ToggleSwitch control={control} name="recurring" label="Repeat"/>

      {/* Save Button */}
      {errorMessage && (Alert.alert("Error",errorMessage))}
      <CustomButton onPress={handleSubmit(onBillSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}