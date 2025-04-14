import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert} from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import NotesInput from "@/components/inputs/NotesInput";
import WalletSelector from "@/components/selectors/WalletSelector";
import PhotoSelector from "@/components/selectors/PhotoSelector";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import CategorySelector from "@/components/selectors/CategorySelector";
import { useCreatePersonalTransactionMutation } from "@/store/personalTransactionApi";
import { useGetUserWalletsQuery } from "@/store/userApi";
import { useDeleteDetectedTransactionMutation } from "@/store/detectedTransactionApi";
import { globalStyles } from "@/styles/globalStyles";

export type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Description?: error;
}

type LocalParams = {
  detectedId?: string;
  detectedAmount?: string;
  detectedDescription?: string;
  detectedCreated_at_date_time?: string | Date;
  detectedNotes?: string;
  detectedTransaction_type?: "credit" | "debit";
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

export default function AddTransactionScreen() {
  const router = useRouter();
  let { detectedId, detectedAmount, detectedTransaction_type, detectedDescription, detectedCreated_at_date_time, detectedNotes} = useLocalSearchParams() as LocalParams;

  const [createPersonalTransaction, {isLoading:isLoadingPersonal}] = useCreatePersonalTransactionMutation();
  const [deleteTransaction, { isLoading:isLoadingDetected }] = useDeleteDetectedTransactionMutation();
  const { refetch } = useGetUserWalletsQuery();

  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  let detectedAmountNumber = Number(detectedAmount);
  let dateOnly: Date | undefined;
  let timeOnly: Date | undefined;

  if (detectedCreated_at_date_time) {
    const parsedDate = new Date(detectedCreated_at_date_time);

    if (!isNaN(parsedDate.getTime())) {
      dateOnly = new Date(parsedDate.toDateString());
      timeOnly = new Date(1970, 0, 1, parsedDate.getHours(), parsedDate.getMinutes(), parsedDate.getSeconds());
    } else {
      console.warn("Invalid date:", detectedCreated_at_date_time);
    }
  }

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: detectedId
    ? {
      amount: detectedAmountNumber,
      Description: detectedDescription || "",
      transactionType: detectedTransaction_type === "credit" ? "income" : "expense",
      notes: detectedNotes,
      wallet: null,
      category: "",
      date: dateOnly || new Date(),
      time: timeOnly || new Date(),
      photo: null,
    }
    :{
      amount: 0,
      Description: "",
      transactionType: "expense",
      notes: "",
      wallet: null,
      category: "",
      date: new Date(),
      time: new Date(),
      photo: null,
    },
  });


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
  
  useEffect(() => {
    if (detectedId) {
      if(detectedTransaction_type==="credit"){
        setTransactionType("income");
        setValue("transactionType", "income");
      }
      else{
        setTransactionType("expense");
        setValue("transactionType", "expense");
      }
      
    }
  }, [detectedId, setValue]);


  const onTransactionSubmit = async (data: Data) => {
    try {
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
      const formData = new FormData();
      formData.append("transaction_type", transactionType);
      formData.append("description", data.Description);
      if (data?.wallet?._id) {
        formData.append("wallet_id", data?.wallet?._id);
      }
      if (data?.photo) {
        const selectedImage = data.photo;
        const fileExtension = selectedImage.split(".").pop();
        const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
  
        formData.append("media", {
          uri: selectedImage,
          type: mimeType,
          name: `transaction-media.${fileExtension}`,
        } as any);
      }
      if (data?.category) {
        formData.append("transaction_category", data.category);
      }
      if (data?.notes) {
        formData.append("notes", data.notes);
      }
      formData.append("amount", String(data.amount));
      formData.append("created_at_date_time", String(created_at_date_time));
    
      const response = await createPersonalTransaction(formData).unwrap();
      if(detectedId){
        await deleteTransaction(detectedId).unwrap();
      }
      await refetch();
      reset();
      router.replace({
        pathname: "/view/viewTransaction", params: { id:response.data._id}
      });
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

  if(isLoadingPersonal) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  return (
    <ScrollView style={globalStyles.viewContainer}>
      
      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>Add Spend</Text>
      </View>

      {/* Transaction Type Selector */}
      <View style={styles.transactionTypeContainer}>
        {(["expense", "income"] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.transactionTypeButton,
              transactionType === type && styles.selectedType,
              detectedId && styles.disabledType,

            ]}
            onPress={() => {
              if (!detectedId) { // Prevent state change when frozen
                setTransactionType(type);
                setValue("transactionType", type);
              }
            }}
            disabled={detectedId!==undefined} 

          >
            <Text style={[styles.transactionTypeText, transactionType === type && styles.selectedText, detectedId && styles.disabledText, // Change text color if frozen
            ]}>
              {type === "expense" ? "Expense" : "Income"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {detectedId?(<AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors}/>):<AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors}/>}
      <NotesInput control={control} name="notes" />
      
      <View style={globalStyles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>

        {transactionType === "expense" && (<CategorySelector control={control} />)}
      <View style={globalStyles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date" disableFutureDates/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View>

       {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  disabledType: {
    opacity: 0.8, // Make it look disabled
  },
  disabledText: {
    color: "#black", // Greyed-out text
  },
});