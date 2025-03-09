import React, { useState } from "react";
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

export default function AddExpenseScreen() {
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount: 0,
      description: "",
      splitWith: [{ user_id: "1", amount: 0 }],
      paidBy: { id: "1", name: "You" },
      notes: "",
      wallet: "",
      category: "",
      date: new Date(),
      time: new Date(),
      photo: null,
    },
  });

  const users = [
    { id: "1", name:  "user1"},
    { id: "2", name:  "user2"},
    { id: "3", name:  "user3"},
    { id: "4", name:  "user4"}
  ]

  const wallets = [
    { id: "1", name:  "wallet1"},
    { id: "2", name:  "wallet2"},
    { id: "3", name:  "wallet3"},
    { id: "4", name:  "wallet4"}
  ]
  
  const router = useRouter();
  const amount = watch("amount");
  const splitWith = watch("splitWith");

  const TOLERANCE = 0.1;


  // description,
  //  lenders,
  //     borrowers,
  //     wallet_id,
  //     total_amount,
  //     expense_category,
  //     notes,
  //     group_id,
  //     created_at_date_time,
const onSubmit = (data: any) => {
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

  console.log("Expense Data:", data);
  console.log(created_at_date_time);
  reset();
  router.replace("/(tabs)");
};


  return (
    <ScrollView style={styles.container}>

        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Add Expense</Text>
      </View>

      <AmountDescriptionInput control={control} label="Description"/>
      <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} IncludePaidBy/>
      <NotesInput control={control} name="notes" />

      <View style={styles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet" wallets={wallets}/>
        <PhotoSelector control={control} />
      </View>

      <CategorySelector control={control} />

      <View style={styles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date"/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View>
      
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
});