import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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

export default function CreateBillScreen() {
  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      amount: 0,
      title: "",
      splitWith: [{ user_id: "1", amount: 0 }],
      members: [],
      date: new Date(),
      time: null,
      category: "",
      recurring: false
    },
  });

  const router = useRouter();

//   bill_title, amount, bill_category, due_date_time, recurring, members
  const onBillSubmit = (data: any) => {
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
    console.log("Bill Data:", data);
    reset();
    router.replace("/(tabs)");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>New Bill</Text>
      </View>

      {/* Bill Title and amount */}
      <AmountDescriptionInput control={control} label = "Title"/>

      {/* Add Members to share */}
      {/* <AddPeopleInput control={control} /> */}
      <SplitWithSelector control={control} setValue={setValue} amount={watch("amount")} title="Share with"/>

      {/* Initial Budget & Date */}
      <View style={styles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Due Date"/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Due Time" />
      </View>
      <CategorySelector control={control}/>
      <ToggleSwitch control={control} name="recurring" label="Repeat"/>

      {/* Save Button */}
      <CustomButton onPress={handleSubmit(onBillSubmit)} style={styles.button}>Save</CustomButton>
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
    justifyContent: "space-between",
    alignItems: "center",
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
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  button: {
    marginVertical: 15,
    alignSelf: "center",
  },
});