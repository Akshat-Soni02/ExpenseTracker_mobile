import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import SplitWithSelector from "@/components/SplitWithSelector";
import NotesInput from "@/components/NotesInput";
import WalletSelector from "@/components/WalletSelector";
import PhotoSelector from "@/components/PhotoSelector";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CategorySelector from "@/components/CategorySelector";
import { useUpdateExpenseMutation } from "@/store/expenseApi";
import { useDeleteDetectedTransactionMutation } from "@/store/detectedTransactionApi";
import { useLocalSearchParams } from "expo-router";
import { useGetExpenseQuery } from "@/store/expenseApi";
import { useLazyGetUserByIdQuery,useGetUserByIdQuery } from "@/store/userApi";
import { useLazyGetWalletQuery,useGetWalletQuery } from "@/store/walletApi";
import _ from "lodash";

export default function EditExpenseScreen() {

    let {id,paidByName} = useLocalSearchParams();
    const { data, isLoading, error, refetch } = useGetExpenseQuery(id);

    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
    const [getUserById, { data: creatorData }] = useLazyGetUserByIdQuery();
    const [borrowerNames, setBorrowerNames] = useState<Record<string, string>>({});
    const [lenderName, setLenderName] = useState("Unknown");
    const [userState, setUserState] = useState(null);
    // const [getWallet, { data: walletData }] = useLazyGetWalletQuery();
    let walletData, walletIsLoading, walletError;
    
    if (data?.data.wallet_id) {
        ({ data: walletData, isLoading: walletIsLoading, error: walletError } = useGetWalletQuery(data.data.wallet_id));
    }
    // const {data:lenderData,isLoading:lenderIsLoading,error:lenderError} = getUserById(expense.lenders.user_id);
    const expense = data?.data;
    const lender = {"name" : paidByName,"profile_photo":undefined,"user_id":expense.lenders[0].user_id};
    // const borrowers = [{}];
    const [updateExpense, {isLoading:isLoadingExpense}] = useUpdateExpenseMutation();
    const splitWithArray = expense.borrowers.map(b => ({
      amount: b.amount,
      user_id: b.user_id
    }));
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues:{
          amount: expense.total_amount,
          Description: expense.description,
          splitWith: splitWithArray,
          paidBy: lender,
          notes: expense.notes,
          wallet: walletData?.data,
          category: expense.expense_category,
          date:expense.created_at_date_time,
          time:expense.created_at_date_time,
          photo: null,
        },
  });
  

  const router = useRouter();
  const amount = watch("amount");
  const splitWith = watch("splitWith");

  const TOLERANCE = 0.1;

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
        childErrors.amount?.message,
        childErrors.Description?.message
      ].filter(Boolean).join("\n");
  
      Alert.alert("Invalid data", messages);
    }
  }, [childErrors]);


  // description,
  // lenders,
  // borrowers,
  // wallet_id,
  // total_amount,
  // expense_category,
  // notes,
  // group_id,
  // created_at_date_time,
  const onSubmit = async (data: any) => {
    try {
      const totalSplit = splitWith.reduce((sum, person) => sum + Number(person.amount), 0);
      if (Math.abs(totalSplit - amount) > TOLERANCE) {
        alert("Total split amount must match the entered amount");
        return;
      }
  
      // Constructing the datetime properly
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

  
      let amt = 0;
      data.splitWith.forEach((user) => {
        if (user.user_id === data.paidBy.user_id) amt = user.amount;
      });
      const filteredSplit = data.splitWith.filter((user) => user.user_id !== data.paidBy.user_id);
      const selectedImage = data?.photo;

  
  
      const formData = new FormData();
      if(data.Description!==expense.description){
        formData.append("description", data.Description);
      }
      const lendersData = [{ ...data.paidBy, amount: data.amount - amt }];
      const borrowersData = filteredSplit.map((user) => ({ ...user, amount: Number(user.amount) }));
      const simplifiedLenders = lendersData.map(({ user_id, amount }) => ({ user_id, amount }));
      const simplifiedBorrowers = borrowersData.map(({ user_id, amount }) => ({ user_id, amount }));

      const prevLenders = expense.lenders.map(({ user_id, amount }) => ({ user_id, amount }));
      const prevBorrowers = expense.borrowers.map(({ user_id, amount }) => ({ user_id, amount }));

      
      if (!_.isEqual(simplifiedLenders, prevLenders) || !_.isEqual(simplifiedBorrowers, prevBorrowers) || data.amount!==expense.total_amount) {
        formData.append("lenders", JSON.stringify(lendersData));
        formData.append("borrowers", JSON.stringify(borrowersData));
        formData.append("total_amount", String(data.amount));
    }
      // formData.append("lenders", JSON.stringify([{ ...data.paidBy, amount: data.amount - amt }]));
      // formData.append("borrowers", JSON.stringify(filteredSplit.map((user) => ({ ...user, amount: Number(user.amount) }))));

      if (data?.wallet?._id!=expense.wallet_id) {
        formData.append("wallet_id", data.wallet._id);
      }

      if (data?.category!==expense.expense_category) {
        formData.append("expense_category", data.category);
      }

      if (data?.notes!==expense.notes) {
        formData.append("notes", data.notes);
      }

      // if (data?.group_id!==expense.) {
      //   formData.append("group_id", data.group_id);
      // }

      // if (selectedImage) {
      //   const fileExtension = selectedImage.split(".").pop();
      //   const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
  
      //   formData.append("media", {
      //     uri: selectedImage,
      //     type: mimeType,
      //     name: `split-media.${fileExtension}`,
      //   } as any);
      // }

      const isEmpty = ![...formData.entries()].length;
      if(isEmpty) {
        router.back();
      }
      const response = await updateExpense({expense_id:id,body:formData}).unwrap();
      router.back();
    } catch (error) {
      console.error("new expense failed to create:", error);
      const err = error as { data?: { message?: string } };
      setErrorMessage(err?.data?.message || "Something went wrong. Please try again.");
    }
  };  
  
  


  return (
    <ScrollView style={styles.container}>

        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Split</Text>
      </View>

      <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>
      <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} IncludePaidBy edit={true}/>
      <NotesInput control={control} name="notes" />

      <View style={styles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>

      <CategorySelector control={control} />

      <View style={styles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date" disableFutureDates/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View>
      
      {errorMessage && (Alert.alert("Error",errorMessage))}
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
    marginTop: 30,
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