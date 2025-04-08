import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter,useLocalSearchParams } from "expo-router";
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
import { useUpdateBillMutation , useGetBillQuery} from "@/store/billApi";
import _ from "lodash";
import { globalStyles } from "@/styles/globalStyles";

export default function CreateBillScreen() {
      let {id} = useLocalSearchParams();
      const { data:billData, isLoading:billIsLoading, error:billError, refetch } = useGetBillQuery(id);
      const splitWithArray = billData.data.members.map(m => ({
        amount: m.amount,
        user_id: m.user_id
      }));
  const [updateBill, {isLoading}] = useUpdateBillMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      amount: billData.data.amount,
      Title: billData.data.bill_title,
      // Description:billData.data.bill_title,
      // splitWith: [{ user_id: "1", amount: 0 }],
      splitWith:splitWithArray,
      members: billData.data.members,
      date: new Date(billData.data.due_date_time),
      time: new Date(billData.data.due_date_time),
      category: billData.data.bill_category,
      recurring: billData.data.recurring
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
      // const filteredSplit = data.splitWith.filter((user) => user.user_id !== data.paidBy.user_id);


      let dataObj: { amount?: number; bill_title?:string;bill_category?:string;due_date_time?:any;recurring?:boolean;members?:any} = {};
      if(data.amount!==billData.data.amount){
        dataObj.amount = data.amount;
      }
      if(data.Title!==billData.data.bill_title){
        dataObj.bill_title = data.Title;
      }
      if(data.category!==billData.data.bill_category){
        dataObj.bill_category= data.category;
      }
      if(due_date_time!==billData.data.due_date_time){
        dataObj.due_date_time = data.due_date_time;
      }
      if(data.recurring!==billData.data.recurring){
        dataObj.recurring=data.recurring;
      }
      // if(data.members!==billData.data.members){
      //   dataObj.members=data.members;
      // }
      const borrowersData = data.splitWith.map((user) => ({ ...user, amount: Number(user.amount) }));
      const simplifiedBorrowers = borrowersData.map(({ user_id, amount }) => ({ user_id, amount }));
      const prevBorrowers = billData.data.members.map(({ user_id, amount }) => ({ user_id, amount }));
      if (!_.isEqual(simplifiedBorrowers, prevBorrowers)) {
            let members = [];
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

  return (
    <ScrollView style={globalStyles.viewContainer}>
      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>Edit Bill</Text>
      </View>

      {/* Bill Title and amount */}
      <AmountDescriptionInput control={control} label = "Title" onErrorsChange={setChildErrors}/>

      {/* Add Members to share */}
      {/* <AddPeopleInput control={control} /> */}
      <SplitWithSelector control={control} setValue={setValue} amount={watch("amount")} edit = {true} title="Share with"/>

      {/* Initial Budget & Date */}
      <View style={globalStyles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Due Date"/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Due Time" />
      </View>
      <CategorySelector control={control}/>
      <ToggleSwitch control={control} name="recurring" label="Repeat"/>

      {/* Save Button */}
      {errorMessage && (Alert.alert("Error",errorMessage))}
      <CustomButton onPress={handleSubmit(onBillSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}