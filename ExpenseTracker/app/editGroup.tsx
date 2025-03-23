import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import TitleInput from "@/components/TitleInput";
import AddPeopleInput from "@/components/AddPeopleInput";
import InitialBudget from "@/components/InitialBudget";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import { useUpdateGroupMutation,useGetGroupQuery } from "@/store/groupApi";

export default function CreateGroupScreen() {
    const {id} = useLocalSearchParams();
    const { data:groupData, isLoading:groupIsLoading, error:groupError, refetch } = useGetGroupQuery(id);
    console.log("GroupData",groupData.data.initial_budget);
  const [updateGroup, {isLoading}] = useUpdateGroupMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const membersArray = groupData.data.members.map(m => ({
    amount: m.amount,
    user_id: m.user_id
  }));
  console.log("Group members",groupData.data.members);
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: groupData.data.group_title,
      initialBudget: groupData.data.initial_budget,
      settleUpDate: new Date(groupData.data.settle_up_date),
    },
  });

  const router = useRouter();

//   group_title,
//     memberIds = [],
//     initial_budget,
//     settle_up_date,

  const onGroupSubmit = async (data: any) => {
    try {
      console.log("Group Data:", data);

      let dataObj: {group_title?:string;initial_budget?:Number;settle_up_date?:any} = {};
      if(data.title!==groupData.data.group_title){
        console.log("Heregrouptitle");
        dataObj.group_title = data.title;
      }
      if(data.initialBudget!==groupData.data.initial_budget){
        console.log("HereInitialBudget");
        dataObj.initial_budget = data.initialBudget;
      }
      if(data.settleUpDate!==groupData.data.settle_up_date){
        console.log("HereSettleupdate");
        dataObj.settle_up_date= data.settleUpDate;
      }
      

      const response = await updateGroup({id:id,body:dataObj}).unwrap();
      console.log("Update group response: ", response);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Group</Text>
      </View>

      {/* Group Title */}
      <TitleInput control={control} />

      {/* Add Members */}

      {/* Initial Budget & Date */}
      <View style={styles.dateTimeContainer}>
        <InitialBudget control={control} />
        <CustomDateTimePicker control={control} name="settleUpDate" label="Date" heading="Settle-up Date"/>
      </View>

      {/* Save Button */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <CustomButton onPress={handleSubmit(onGroupSubmit)} style={styles.button}>Save</CustomButton>
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
    marginTop: 30,
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
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  }
});