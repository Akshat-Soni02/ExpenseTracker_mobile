import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import SplitWithSelector from "@/components/SplitWithSelector";
import NotesInput from "@/components/NotesInput";
import WalletSelector from "@/components/WalletSelector";
import PhotoSelector from "@/components/PhotoSelector";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CategorySelector from "@/components/CategorySelector";
import { useCreateExpenseMutation } from "@/store/expenseApi";
import { useDeleteDetectedTransactionMutation } from "@/store/detectedTransactionApi";
import {globalStyles} from "@/styles/globalStyles";
export default function AddExpenseScreen() {
  let {group_id, group_name,detectedId, detectedAmount,detectedTransaction_type,detectedDescription,detectedFrom_account,detectedTo_account,detectedCreated_at_date_time,detectedNotes} = useLocalSearchParams();
  let detectedAmountNumber = Number(detectedAmount);
  const date_time = new Date(detectedCreated_at_date_time);
  const parsedDate = new Date(date_time);
  const dateOnly = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  const timeOnly = new Date(1970, 0, 1, parsedDate.getHours(), parsedDate.getMinutes(), parsedDate.getSeconds());


  const [createExpense, {isLoading:isLoadingExpense}] = useCreateExpenseMutation();
  const [deleteTransaction, { isLoading:isLoadingDetected }] = useDeleteDetectedTransactionMutation();

  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});
  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: detectedId
      ? {
          amount: detectedAmountNumber,
          Description: detectedDescription,
          splitWith: null,
          paidBy: null,
          notes: detectedNotes,
          wallet: null,
          category: "",
          date:dateOnly,
          time:timeOnly,
          photo: null,
        }
      : {
          amount: null,
          Description: "",
          splitWith: null,
          paidBy: null,
          notes: "",
          wallet: null,
          category: "",
          date: new Date(),
          time: new Date(),
          photo: null,
        },
  });
  
  
  const router = useRouter();
  const amount = watch("amount");
  const splitWith = watch("splitWith");

  const TOLERANCE = 0.1;

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      console.log("errors",errors)
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
      const totalSplit = splitWith.reduce((sum, person) => sum + Number(person.amount), 0);
  
      if (Math.abs(totalSplit - amount) > TOLERANCE) {
        alert("Total split amount must match the entered amount");
        return;
      }
      // Constructing the datetime properly
      const selectedDate = new Date(data.date);
      const selectedTime = new Date(data.time);
      const created_at_date_time = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds()
      );

  
      let amt = 0;
      data.splitWith.forEach((user) => {
        if (user.user_id === data.paidBy.user_id) amt = user.amount;
      });
      const filteredSplit = data.splitWith.filter((user) => user.user_id !== data.paidBy.user_id);
      const selectedImage = data?.photo;

  
  
      const formData = new FormData();
      formData.append("description", data.Description);
      formData.append("lenders", JSON.stringify([{ ...data.paidBy, amount: data.amount - amt }]));
      formData.append("borrowers", JSON.stringify(filteredSplit.map((user) => ({ ...user, amount: Number(user.amount) }))));

      if (data?.wallet?._id) {
        formData.append("wallet_id", data.wallet._id);
      }
      if(group_id) {
        formData.append("group_id", group_id);
      }
      formData.append("total_amount", String(data.amount));
      if (data?.category) {
        formData.append("expense_category", data.category);
      }
      if (data?.notes) {
        formData.append("notes", data.notes);
      }
      if (selectedImage) {
        const fileExtension = selectedImage.split(".").pop();
        const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
  
        formData.append("media", {
          uri: selectedImage,
          type: mimeType,
          name: `split-media.${fileExtension}`,
        } as any);
      }
      formData.append("created_at_date_time", String(created_at_date_time));
      const response = await createExpense(formData).unwrap();
      reset();
      router.replace({ pathname: "/view/viewExpense", params: { id:response?.data?._id} });
    } catch (error) {
      console.error("new expense failed to create:", error);
      const err = error as { data?: { message?: string } };
      setErrorMessage(err?.data?.message || "Something went wrong. Please try again.");
    }
  };  
  
  

  if(isLoadingExpense) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  return (
    <ScrollView style={globalStyles.viewContainer}>
        <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>New Split</Text>
      </View>
      {group_name && (<Text style = {{fontWeight: "500", alignSelf: "center", fontSize: 18, marginVertical: 5}}>Adding in {group_name}</Text>)}
      {detectedId?(<AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors}/>):(<AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>)}
      <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} group_id = {group_id} IncludePaidBy/>
      <NotesInput control={control} name="notes" />

      <View style={globalStyles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>

      <CategorySelector control={control} />

      <View style={globalStyles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date" disableFutureDates/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View>
      
      {errorMessage && (Alert.alert("Error",errorMessage))}
      <CustomButton onPress={handleSubmit(onSubmit)} style={globalStyles.saveButton} disabled = {!splitWith || splitWith.length == 0 || Math.abs(splitWith.reduce((sum, person) => sum + Number(person.amount), 0) - amount) > TOLERANCE}>{(!splitWith || splitWith.length == 0 || Math.abs(splitWith.reduce((sum, person) => sum + Number(person.amount), 0) - amount) > TOLERANCE) ? ("Split amount must match total") : ("Save")}</CustomButton>
    </ScrollView>
  );
}