import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import NotesInput from "@/components/inputs/NotesInput";
import WalletSelector from "@/components/selectors/WalletSelector";
import PhotoSelector from "@/components/selectors/PhotoSelector";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import CategorySelector from "@/components/selectors/CategorySelector";

import { useUpdatePersonalTransactionMutation ,useGetPersonalTransactionQuery, Transaction} from "@/store/personalTransactionApi";
import { useEffect } from "react";
import {useGetWalletQuery} from "@/store/walletApi";
import { globalStyles } from "@/styles/globalStyles";

export type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Description?: error;
}

type Data = {
  date: Date | string;
  time: Date | string;
  photo?: string | null;
  wallet?: {_id: string} | null;
  amount: number;
  category?: string;
  notes?: string;
  Description: string;
}

export default function EditTransactionScreen() {
  const router = useRouter();
  let {fetchedId} = useLocalSearchParams() as {fetchedId: string};

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");

  const { data:fetchedData, isLoading, error: transactionError, refetch } = useGetPersonalTransactionQuery(fetchedId);
  const [updatePersonalTransaction, {isLoading:isLoadingPersonal}] = useUpdatePersonalTransactionMutation();

  let walletData, walletIsLoading, walletError;
  if (fetchedData?.data.wallet_id) {
      ({ data: walletData, isLoading: walletIsLoading, error: walletError } = useGetWalletQuery(fetchedData.data.wallet_id));
  }

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues:{
      amount: fetchedData?.data.amount || 0,
      Description: fetchedData?.data.description || "",
      transactionType: fetchedData?.data.transaction_type,
      notes: fetchedData?.data.notes,
      wallet: walletData?.data,
      category: fetchedData?.data.transaction_category,
      date: fetchedData ? new Date(fetchedData?.data.created_at_date_time) : new Date(),
      time: fetchedData ? new Date(fetchedData?.data.created_at_date_time) : new Date(),
      photo: null,
    }
  });


  useEffect(() => {
    if(!isLoading && fetchedData?.data.transaction_type) {
      setTransactionType(fetchedData.data.transaction_type);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      const messages = [
        childErrors.amount?.message,
        childErrors.Description?.message
      ].filter(Boolean).join("\n");
  
      Alert.alert("Invalid data", messages);
    }
  }, [childErrors]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);


  const onTransactionSubmit = async (data: Data) => {
    try {
      console.log("Transaction edit data, ",data);
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
      let dataObj: Partial<Transaction> = {};
      if(data.amount!==fetchedData?.data.amount){
        dataObj.amount = data.amount;
      }
      if(transactionType!==fetchedData?.data.transaction_type){
        dataObj.transaction_type = transactionType;
      }
      if(data.Description!==fetchedData?.data.description){
        dataObj.description = data.Description;
      }
      if(data?.wallet?._id && data.wallet._id !== fetchedData?.data?.wallet_id){
        dataObj.wallet_id = data.wallet._id;
      }
      if(data.category!==fetchedData?.data.transaction_category){
        dataObj.transaction_category=data.category;
      }
      if(data.notes!==fetchedData?.data.notes){
        dataObj.notes = data.notes;
      }
      if(created_at_date_time && created_at_date_time!==fetchedData?.data.created_at_date_time){
        dataObj.created_at_date_time = created_at_date_time;
      }
      const response = await updatePersonalTransaction({id:fetchedId,body:dataObj}).unwrap();
      router.back();
    } catch (error) {
      console.error("new personal transaction failed to create:", error);
        const err = error as { data?: { message?: string } };
        if (err?.data?.message) {
          setErrorMessage(err.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
    }
  };

  if(isLoading || isLoadingPersonal) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  
  if (transactionError) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in transactionError) {
      errorMessage = `Server Error: ${JSON.stringify(transactionError.data)}`;
    } else if ("message" in transactionError) {
      errorMessage = `Client Error: ${transactionError.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  return (
    <ScrollView style={globalStyles.viewContainer}>

      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>Edit Spend</Text>
      </View>

      <View style={styles.transactionTypeContainer}>
        {(["expense", "income"] as const).map((type) => (
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
            <Text style={[styles.transactionTypeText, transactionType === type && styles.selectedText,// Change text color if frozen
            ]}>
              {type === "expense" ? "Expense" : "Income"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>
      <NotesInput control={control} name="notes" />
      
      <View style={globalStyles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>

      <CategorySelector control={control} />
      <View style={globalStyles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date" disableFutureDates/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View>

      <CustomButton onPress={handleSubmit(onTransactionSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  
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
  disabledType: {
    opacity: 0.8, // Make it look disabled
  },
  disabledText: {
    color: "#black", // Greyed-out text
  },
});