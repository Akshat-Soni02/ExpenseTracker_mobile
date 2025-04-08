import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import CategorySelector from "@/components/selectors/CategorySelector";
import ToggleSwitch from "@/components/inputs/ToggleSwitch";
import SplitWithSelector from "@/components/peopleSelectors/SplitWithSelector";
import CustomButton from "@/components/button/CustomButton";
import { Member, useCreateBillMutation } from "@/store/billApi";

type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Title?: error;
}

type BillMember = {
  user_id: string;
  amount: number;
  status: "pending";
}

type Data = {
  date: Date;
  time: Date;
  splitWith: { user_id: string, amount: number}[];
  Title: string;
  amount: number;
  category?: string;
  recurring: boolean;
  members?: Member[];
}

export default function CreateBillScreen() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  const [createBill, {isLoading, error: errorBill}] = useCreateBillMutation();

  const { control, handleSubmit, setValue, reset, watch } = useForm<Data>({
    defaultValues: {
      amount: 0,
      Title: "",
      splitWith: [],
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
        childErrors?.amount?.message,
        childErrors?.Title?.message
      ].filter(Boolean).join("\n");
  
      Alert.alert("Invalid data", messages);
    }
  }, [childErrors]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);
  

  const onBillSubmit = async (data: Data) => {
    try {
      console.log("bill data: ",data);
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

      let members: BillMember[] = [];
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
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>New Bill</Text>
      </View>

      <AmountDescriptionInput control={control} label = "Title" onErrorsChange={setChildErrors}/>

      <SplitWithSelector control={control} setValue={setValue} amount={watch("amount")} title="Share with"/>

      <View style={styles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Due Date"/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Due Time" useDefaultToday/>
      </View>

      <CategorySelector control={control}/>
      <ToggleSwitch control={control} name="recurring" label="Repeat"/>

      <CustomButton onPress={handleSubmit(onBillSubmit)} style={styles.button}>Save</CustomButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10
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