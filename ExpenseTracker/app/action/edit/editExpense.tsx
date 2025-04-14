import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import _ from "lodash";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import SplitWithSelector from "@/components/peopleSelectors/SplitWithSelector";
import NotesInput from "@/components/inputs/NotesInput";
import WalletSelector from "@/components/selectors/WalletSelector";
import PhotoSelector from "@/components/selectors/PhotoSelector";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import CategorySelector from "@/components/selectors/CategorySelector";
import { useUpdateExpenseMutation } from "@/store/expenseApi";
import { useGetExpenseQuery } from "@/store/expenseApi";
import { useLazyGetUserByIdQuery } from "@/store/userApi";
import { useGetWalletQuery } from "@/store/walletApi";
import { globalStyles } from "@/styles/globalStyles";
export type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Description?: error;
}

type LocalParams = {
  id: string;
  paidByName: string;
}

type Data = {
  date: Date | string;
  time: Date | string;
  splitWith: { user_id: string, amount: number }[];
  paidBy: { user_id: string, name: string, profile_photo?: string };
  photo?: string;
  wallet?: {_id: string} | null;
  amount: number;
  category?: string;
  notes?: string;
  Description: string;
}

export default function EditExpenseScreen() {

  let { id, paidByName } = useLocalSearchParams() as LocalParams;
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});
  
  const { data, isLoading, error: errorExpense, refetch } = useGetExpenseQuery(id);
  const [getUserById, { data: creatorData }] = useLazyGetUserByIdQuery();
  const [updateExpense, {isLoading: isLoadingExpense}] = useUpdateExpenseMutation();

  let walletData, walletIsLoading, walletError;
  if (data?.data.wallet_id) {
      ({ data: walletData, isLoading: walletIsLoading, error: walletError } = useGetWalletQuery(data.data.wallet_id));
  }
  const expense = data?.data;
  const lender = {"name" : paidByName, "profile_photo": undefined, "user_id": expense?.lenders[0].user_id};
  const splitWithArray = expense?.borrowers.map(b => ({
    amount: b.amount,
    user_id: b.user_id
  }));
  
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues:{
          amount: expense?.total_amount || 0,
          Description: expense?.description || "",
          splitWith: splitWithArray || [],
          paidBy: lender || [],
          notes: expense?.notes || "",
          wallet: walletData?.data || null,
          category: expense?.expense_category || "",
          date: expense?.created_at_date_time || new Date(),
          time: expense?.created_at_date_time || new Date(),
          photo: null,
        },
  });
  

  const router = useRouter();
  const amount = watch("amount");
  const splitWith = watch("splitWith");
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

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);

  const onSubmit = async (data: Data) => {
    try {
      const totalSplit = splitWith?.reduce((sum, person) => sum + Number(person.amount), 0);
      if (Math.abs(totalSplit - amount) > TOLERANCE) {
        alert("Total split amount must match the entered amount");
        return;
      }
  
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
      if(data.Description!==expense?.description){
        formData.append("description", data.Description);
      }
      const lendersData = [{ ...data.paidBy, amount: data.amount - amt }];
      const borrowersData = filteredSplit.map((user) => ({ ...user, amount: Number(user.amount) }));
      const simplifiedLenders = lendersData.map(({ user_id, amount }) => ({ user_id, amount }));
      const simplifiedBorrowers = borrowersData.map(({ user_id, amount }) => ({ user_id, amount }));

      const prevLenders = expense?.lenders.map(({ user_id, amount }) => ({ user_id, amount }));
      const prevBorrowers = expense?.borrowers.map(({ user_id, amount }) => ({ user_id, amount }));

      
      if (!_.isEqual(simplifiedLenders, prevLenders) || !_.isEqual(simplifiedBorrowers, prevBorrowers) || data.amount!==expense?.total_amount) {
        formData.append("lenders", JSON.stringify(lendersData));
        formData.append("borrowers", JSON.stringify(borrowersData));
        formData.append("total_amount", String(data.amount));
      }

      if (data?.wallet?._id && data.wallet._id !== expense?.wallet_id) {
        formData.append("wallet_id", data.wallet._id);
      }      

      if (data.category && data?.category!==expense?.expense_category) {
        formData.append("expense_category", data?.category);
      }

      if (data.notes && data?.notes!==expense?.notes) {
        formData.append("notes", data.notes);
      }

      const isEmpty = ![...formData.entries()].length;
      if(isEmpty) {
        router.back();
      }
      const response = await updateExpense({expense_id: id, body: formData}).unwrap();
      router.back();
    } catch (error) {
      console.error("new expense failed to create:", error);
      const err = error as { data?: { message?: string } };
      setErrorMessage(err?.data?.message || "Something went wrong. Please try again.");
    }
  };  

  if (isLoadingExpense || isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (errorExpense) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorExpense) {
      errorMessage = `Server Error: ${JSON.stringify(errorExpense.data)}`;
    } else if ("message" in errorExpense) {
      errorMessage = `Client Error: ${errorExpense.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  return (
    <ScrollView style={globalStyles.viewContainer}>

        <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>Edit Split</Text>
      </View>

      <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>
      <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} IncludePaidBy edit={true}/>
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
});