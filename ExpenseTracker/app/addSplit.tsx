import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
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

export default function AddExpenseScreen() {
  const [createExpense, {isLoading}] = useCreateExpenseMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount: null,
      description: "",
      splitWith: null,
      paidBy: null,
      notes: "",
      wallet: "",
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
    console.log("split:", totalSplit, "amount:", amount);

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

    
    console.log(created_at_date_time);
    const filteredSplit = data.splitWith.filter((user) => user.user_id != data.paidBy.user_id);
    console.log("Expense Data:", data);
    const response = await createExpense({
      description: data.Description,
      lenders: [data.paidBy],
      borrowers: filteredSplit,
      wallet_id: data?.wallet,
      total_amount: data.amount,
      expense_category: data?.category,
      notes: data?.notes,
      group_id: data?.group_id,
      created_at_date_time,
      filePath: data?.photo?._j
    }).unwrap();
    console.log("adding new expense response:", response);
    reset();
    router.replace("/(tabs)");
  } catch (error) {
    console.error("new expense failed to create:", error);
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
        <Text style={styles.header}>New Split</Text>
      </View>

      <AmountDescriptionInput control={control} label="Description"/>
      <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} IncludePaidBy/>
      <NotesInput control={control} name="notes" />

      <View style={styles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>

      <CategorySelector control={control} />

      <View style={styles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date"/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View>
      
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