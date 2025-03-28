import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert} from "react-native";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import NotesInput from "@/components/NotesInput";
import WalletSelector from "@/components/WalletSelector";
import PhotoSelector from "@/components/PhotoSelector";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CategorySelector from "@/components/CategorySelector";
import { useCreatePersonalTransactionMutation } from "@/store/personalTransactionApi";
import { useGetUserWalletsQuery } from "@/store/userApi";
import { useLocalSearchParams } from "expo-router";
import { useDeleteDetectedTransactionMutation } from "@/store/detectedTransactionApi";
import { useEffect } from "react";
export default function AddTransactionScreen() {
  let {detectedId, detectedAmount,detectedTransaction_type,detectedDescription,detectedFrom_account,detectedTo_account,detectedCreated_at_date_time,detectedNotes} = useLocalSearchParams();
  let detectedAmountNumber = Number(detectedAmount);

  const date_time = new Date(detectedCreated_at_date_time);
  const parsedDate = new Date(date_time);
  const dateOnly = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  const timeOnly = new Date(1970, 0, 1, parsedDate.getHours(), parsedDate.getMinutes(), parsedDate.getSeconds());
  const [childErrors, setChildErrors] = useState({});
  
  const [createPersonalTransaction, {isLoading:isLoadingPersonal}] = useCreatePersonalTransactionMutation();
  const [deleteTransaction, { isLoading:isLoadingDetected }] = useDeleteDetectedTransactionMutation();
  
  const { refetch } = useGetUserWalletsQuery();
  const [errorMessage, setErrorMessage] = useState("");
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: detectedId
    ?{
      amount: detectedAmountNumber,
      Description: detectedDescription,
      transactionType: detectedTransaction_type,
      notes: detectedNotes,
      wallet: "",
      category: "",
      date: dateOnly,
      time: timeOnly,
      photo: null,
    }
    :{
      amount: 0,
      Description: "",
      transactionType: "expense",
      notes: "",
      wallet: "",
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


  const [transactionType, setTransactionType] = useState("expense");
  const router = useRouter();
  useEffect(() => {
    if (detectedId) {
      if(detectedTransaction_type==="credit"){
        setTransactionType("expense");
        setValue("transactionType", "expense");
      }
      else{
        setTransactionType("income");
        setValue("transactionType", "income");
      }
      
    }
  }, [detectedId, setValue]);

//   {transaction_type, description, wallet_id, media, transaction_category, notes,amount, created_at_date_time}
  const onTransactionSubmit = async (data: any) => {
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
      router.replace("/(tabs)");
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
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Add Spend</Text>
      </View>

      {/* Transaction Type Selector */}
      <View style={styles.transactionTypeContainer}>
        {["expense", "income"].map((type) => (
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
      
      <View style={styles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>

        {transactionType === "expense" && (<CategorySelector control={control} />)}
      <View style={styles.dateTimeContainer}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date" disableFutureDates/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View>

       {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <CustomButton onPress={handleSubmit(onTransactionSubmit)} style={styles.button}>Save</CustomButton>
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
  walletPhotoContainer: {
    flexDirection: "row",
    width: "100%",
    height: 130,
    justifyContent: "space-between",
  },
  dateTimeContainer: {
    flexDirection: "row",
    width: "100%",
    height: 100,
    justifyContent: "space-between",
  },
  button: {
    marginVertical: 15,
    alignSelf: "center",
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