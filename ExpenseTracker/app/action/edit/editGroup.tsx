import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomButton from "@/components/button/CustomButton";
import TitleInput from "@/components/inputs/TitleInput";
import InitialBudget from "@/components/inputs/InitialBudget";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import { useUpdateGroupMutation,useGetGroupQuery, Group } from "@/store/groupApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";

type error = {
  message: string;
}

type ChildErrors = {
  Title?: error;
}

type Data = {
  title: string;
  initialBudget?: number;
  settleUpDate?: Date | null;
}

export default function EditGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as { id: string };
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  const { data: groupData, isLoading: groupIsLoading, error: errorGroup, refetch } = useGetGroupQuery(id);
  const [updateGroup, {isLoading}] = useUpdateGroupMutation();

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: groupData?.data.group_title || "",
      initialBudget: groupData?.data.initial_budget,
      settleUpDate: groupData?.data?.settle_up_date ? new Date(groupData.data.settle_up_date) : null,
    },
  });

  // const membersArray = groupData?.data.members.map(m => ({
  //   amount: m.amount,
  //   user_id: m.user_id
  // }));


  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
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


  const onGroupSubmit = async (data: Data) => {
    try {
      let dataObj: Partial<Group> = {};
      if(data.title!==groupData?.data.group_title){
        dataObj.group_title = data.title;
      }
      if(data.initialBudget!==groupData?.data.initial_budget){
        dataObj.initial_budget = data.initialBudget;
      }
      if(data.settleUpDate!==groupData?.data.settle_up_date){
        dataObj.settle_up_date= data.settleUpDate;
      }

      const response = await updateGroup({id: id, body: dataObj}).unwrap();
      router.back();
    } catch (error) {
      console.error("group failed to update:", error);
        const err = error as { data?: { message?: string } };
        if (err?.data?.message) {
          setErrorMessage(err.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
    }
  };

  if(isLoading || groupIsLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  
  if (errorGroup) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorGroup) {
      errorMessage = `Server Error: ${JSON.stringify(errorGroup.data)}`;
    } else if ("message" in errorGroup) {
      errorMessage = `Client Error: ${errorGroup.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }


  return (
    <ScrollView style={globalStyles.viewContainer}>

      <Header headerText="Edit Group"/>

      <TitleInput control={control} onErrorsChange={setChildErrors}/>

      <View style={globalStyles.dateTimeContainer}>
        <InitialBudget control={control} />
        <CustomDateTimePicker control={control} name="settleUpDate" label="Date" heading="Settle-up Date"/>
      </View>

      {/* Save Button */}
      <CustomButton onPress={handleSubmit(onGroupSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}