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
import { useCreateGroupMutation } from "@/store/groupApi";

export default function CreateGroupScreen() {
  const [createGroup, {isLoading}] = useCreateGroupMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      members: [],
      initialBudget: 0,
      settleUpDate: null,
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
      const response = await createGroup({
        group_title: data.title,
        memberIds: data.selectedUsers,
        initial_budget: data?.initialBudget,
        settle_up_date: data.settleUpDate
      }).unwrap();
      console.log("New group response: ", response);
      reset();
      router.replace("/(tabs)/activity/groups");
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>New Group</Text>
      </View>

      {/* Group Title */}
      <TitleInput control={control} />

      {/* Add Members */}
      <AddPeopleInput control={control} />

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