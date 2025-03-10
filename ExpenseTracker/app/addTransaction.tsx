import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import NotesInput from "@/components/NotesInput";
import WalletSelector from "@/components/WalletSelector";
import PhotoSelector from "@/components/PhotoSelector";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CategorySelector from "@/components/CategorySelector";

export default function AddTransactionScreen() {
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount: 0,
      description: "",
      transactionType: "expense",
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

  const [transactionType, setTransactionType] = useState("expense");
  const router = useRouter();

//   {transaction_type, description, wallet_id, media, transaction_category, notes,amount, created_at_date_time}
  const onTransactionSubmit = (data: any) => {
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
    console.log("Transaction Data:", { ...data, transactionType });
    reset();
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Add Spend</Text>
      </View>

      {/* Transaction Type Selector */}
      <View style={styles.transactionTypeContainer}>
        {["expense", "income"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.transactionTypeButton,
              transactionType === type && styles.selectedType,
            ]}
            onPress={() => {
              setTransactionType(type);
              setValue("transactionType", type);
            }}
          >
            <Text style={[styles.transactionTypeText, transactionType === type && styles.selectedText]}>
              {type === "expense" ? "Expense" : "Income"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AmountDescriptionInput control={control} label="Description"/>
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

      <CustomButton onPress={handleSubmit(onTransactionSubmit)} style={styles.button}>Save</CustomButton>
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
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
  },
  transactionTypeContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    padding: 5,
    alignSelf: "center",
    width: "80%",
    justifyContent: "space-between",
    marginBottom: 10
  },
  transactionTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  selectedType: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  transactionTypeText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  selectedText: {
    fontWeight: "bold",
    color: "#000",
  },
  walletPhotoContainer: {
    flexDirection: "row",
    width: "100%",
    height: 130,
    justifyContent: "space-between",
  },
  dateTimeContainer: {
    flexDirection: "row",
    width: "100%",
    height: 100,
    justifyContent: "space-between",
  },
  button: {
    marginVertical: 15,
    alignSelf: "center",
  },
});