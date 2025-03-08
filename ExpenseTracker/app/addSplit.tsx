import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import SplitWithSelector from "@/components/SplitWithSelector";
import PaidBySelector from "@/components/PaidBySelector";
// import AmountInput from "@/components/AmountInput";
// import DescriptionInput from "@/components/DescriptionInput";
// import SplitWith from "@/components/SplitWith";
// import PaidBy from "@/components/PaidBy";
import NotesInput from "@/components/NotesInput";
import WalletSelector from "@/components/WalletSelector";
// import NotesInput from "@/components/NotesInput";
// import WalletPicker from "@/components/WalletPicker";
// import PhotoPicker from "@/components/PhotoPicker";
// import CategoryPicker from "@/components/CategoryPicker";
// import DateTimePicker from "@/components/DateTimePicker";
import PhotoSelector from "@/components/PhotoSelector";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CategorySelector from "@/components/CategorySelector";

export default function AddExpenseScreen() {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      amount: 0,
      description: "",
      splitWith: [{ name: "You", amount: 0 }],
      paidBy: "You",
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

const onSubmit = (data: any) => {
  const totalSplit = splitWith.reduce((sum, person) => sum + Number(person.amount), 0);
  console.log("split:", totalSplit, "amount:", amount);

  if (Math.abs(totalSplit - amount) > TOLERANCE) {
    alert("Total split amount must match the entered amount");
    return;
  }

  console.log("Expense Data:", data);
  router.back();
};


  return (
    <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Add Expense</Text>
      </View>
      <AmountDescriptionInput control={control}/>
      {/* <AmountInput control={control} name="amount" setValue={setValue} /> */}
      {/* <DescriptionInput control={control} name="description" /> */}
      <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue}/>
      {/* <SplitWith control={control} name="splitWith" amount={amount} setValue={setValue} /> */}
      {/* <PaidBySelector control={control} name="paidBy" users={users}/> */}
      {/* <PaidBy control={control} name="paidBy" /> */}
      <NotesInput control={control} name="notes" />
      <View style={styles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet" wallets={wallets}/>
        <PhotoSelector control={control} />
      </View>
      <CategorySelector control={control} />
      <View style={styles.dateTimeContainer}>
      <CustomDateTimePicker control={control} name="date" label="Date" />
      <CustomDateTimePicker control={control} name="time" label="Time" />
      </View>
      {/* <WalletPicker control={control} name="wallet" /> */}
      {/* <PhotoPicker control={control} name="photo" /> */}
      {/* <CategoryPicker control={control} name="category" /> */}
      {/* <DateTimePicker control={control} name="date" type="date" /> */}
      {/* <DateTimePicker control={control} name="time" type="time" /> */}
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

  // backButton: {
  //   position: "absolute",
  //   top: 50,
  //   left: 20,
  // },
  // header: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   fontFamily: "Poppins_700Bold",
  //   // marginVertical: 20,
  //   marginTop: 50,
  //   flexDirection: "row",
  //   justifyContent: "flex-end",
  //   width: "100%"
  // },
  button: {
    marginVertical: 15,
    alignSelf: "center",
  },
});