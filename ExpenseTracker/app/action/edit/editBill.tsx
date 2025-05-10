import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter,useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import _ from "lodash";

import CustomButton from "@/components/button/CustomButton";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import CategorySelector from "@/components/selectors/CategorySelector";
import ToggleSwitch from "@/components/inputs/ToggleSwitch";
import SplitWithSelector from "@/components/peopleSelectors/SplitWithSelector";
import { useUpdateBillMutation , useGetBillQuery, Bill, Member} from "@/store/billApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";

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

export default function EditBillScreen() {
  const router = useRouter();
  let {id} = useLocalSearchParams() as {id: string};

  const [updateBill, {isLoading}] = useUpdateBillMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  const { data: billData, isLoading: billIsLoading, error: errorBill, refetch } = useGetBillQuery(id);

  const splitWithArray = billData?.data.members?.map(m => ({
    amount: m.amount,
    user_id: m.user_id
  }));


  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      amount: billData?.data.amount || 0,
      Title: billData?.data.bill_title || "",
      splitWith:splitWithArray || [],
      members: billData?.data.members,
      date: billData ? new Date(billData.data.due_date_time) : new Date(),
      time: billData ? new Date(billData.data.due_date_time) : new Date(),
      category: billData?.data.bill_category,
      recurring: billData?.data.recurring || false,
    },
  });

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
        childErrors.amount?.message,
        childErrors.Title?.message
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

      let dataObj: Partial<Bill> = {};

      if(data.amount!==billData?.data.amount){
        dataObj.amount = data.amount;
      }
      if(data.Title!==billData?.data.bill_title){
        dataObj.bill_title = data.Title;
      }
      if(data.category!==billData?.data.bill_category){
        dataObj.bill_category= data.category;
      }
      if(due_date_time!==billData?.data.due_date_time){
        dataObj.due_date_time = due_date_time;
      }
      if(data.recurring!==billData?.data.recurring){
        dataObj.recurring=data.recurring;
      }
      
      const borrowersData = data.splitWith.map((user) => ({ ...user, amount: Number(user.amount) }));
      const simplifiedBorrowers = borrowersData.map(({ user_id, amount }) => ({ user_id, amount }));
      const prevBorrowers = billData?.data.members?.map(({ user_id, amount }) => ({ user_id, amount }));
      if (!_.isEqual(simplifiedBorrowers, prevBorrowers)) {
            let members: BillMember[] = [];
            data?.splitWith.forEach((split) => {
              members.push({user_id: split.user_id, amount: split.amount, status: "pending"})
            });

            dataObj.members = members;
      }
      const response = await updateBill({id:id,body:dataObj}).unwrap();
      router.back();
    } catch (error) {
      console.error("error updating bill:", error);
      const err = error as { data?: { message?: string } };
      if (err?.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  if(isLoading || billIsLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (errorBill) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorBill) {
      errorMessage = `Server Error: ${JSON.stringify(errorBill.data)}`;
    } else if ("message" in errorBill) {
      errorMessage = `Client Error: ${errorBill.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  return (
    <ScrollView style={globalStyles.viewContainer}>

      <Header headerText="Edit Bill"/>

      <AmountDescriptionInput control={control} label = "Title" onErrorsChange={setChildErrors}/>

      {/* Add Members to share */}
      <SplitWithSelector control={control} setValue={setValue} amount={watch("amount")} edit = {true} title="Share with"/>

      {/* Initial Budget & Date */}
      <View style={globalStyles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Due Date"/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Due Time" />
      </View>
      <CategorySelector control={control}/>
      <ToggleSwitch control={control} name="recurring" label="Repeat"/>

      {/* Save Button */}
      <CustomButton onPress={handleSubmit(onBillSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}