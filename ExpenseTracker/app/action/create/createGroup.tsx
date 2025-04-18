import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomButton from "@/components/button/CustomButton";
import TitleInput from "@/components/inputs/TitleInput";
import AddPeopleInput from "@/components/peopleSelectors/AddPeopleInput";
import InitialBudget from "@/components/inputs/InitialBudget";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import { useCreateGroupMutation } from "@/store/groupApi";
import { globalStyles } from "@/styles/globalStyles";


type error = {
  message: string;
}

type ChildErrors = {
  Title?: error;
}

type Data = {
  title: string;
  selectedUsers: string[];
  initialBudget?: number;
  settleUpDate?: Date | null;
}

export default function CreateGroupScreen() {
  const [createGroup, {isLoading}] = useCreateGroupMutation();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  const { control, handleSubmit, setValue, reset, formState: {errors} } = useForm({
    defaultValues: {
      title: "",
      selectedUsers: [],
      initialBudget: 0,
      settleUpDate: null,
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      console.log("errors",errors)
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
      const response = await createGroup({
        group_title: data.title,
        memberIds: data.selectedUsers,
        initial_budget: data?.initialBudget,
        settle_up_date: data.settleUpDate
      }).unwrap();
      reset();
      router.replace({ pathname: "/view/viewGroup", params: { id:response?.data?._id} });
    } catch (error) {
      console.error("new group failed to create:", error);
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
    <ScrollView style={globalStyles.viewContainer}>
      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>New Group</Text>
      </View>

      {/* Group Title */}
      <TitleInput control={control} onErrorsChange={setChildErrors}/>

      {/* Add Members */}
      <AddPeopleInput control={control} />

      {/* Initial Budget & Date */}
      <View style={globalStyles.dateTimeContainer}>
        <InitialBudget control={control} />
        <CustomDateTimePicker control={control} name="settleUpDate" label="Date" heading="Settle-up Date"/>
      </View>

      {/* Save Button */}
      <CustomButton onPress={handleSubmit(onGroupSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}