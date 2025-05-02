import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert ,Image,} from "react-native";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { useProcessReceiptMutation } from '@/store/ocrApi';
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import SplitWithSelector from "@/components/peopleSelectors/SplitWithSelector";
import NotesInput from "@/components/inputs/NotesInput";
import WalletSelector from "@/components/selectors/WalletSelector";
import PhotoSelector from "@/components/selectors/PhotoSelector";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import CategorySelector from "@/components/selectors/CategorySelector";
import { useCreateExpenseMutation } from "@/store/expenseApi";
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
  group_id?: string;
  group_name?: string;
  detectedId?: string;
  detectedAmount?: string;
  detectedDescription?: string;
  detectedCreated_at_date_time?: string | Date;
  detectedNotes?: string;
}

type Data = {
  date: Date | string;
  time: Date | string;
  splitWith: { user_id: string, amount: number }[];
  paidBy: { user_id: string, name: string, profile_photo?: string };
  photo?: string;
  wallet?: {_id: string} | null;
  amount: number;
  category?: string;
  notes?: string;
  Description: string;
  Title?: string;// these fields are just dummy fields to remove typescript errors
  recurring?: boolean;// these fields are just dummy fields to remove typescript errors
}

type OcrResult = {
  amount?: Number;
  vendor?: string;
  date?: string;
  category?: string;
};

export default function AddExpenseScreen() {

  let {group_id, group_name,detectedId, detectedAmount ,detectedDescription, detectedCreated_at_date_time,detectedNotes} = useLocalSearchParams() as LocalParams;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});
  const [validInput, setValidInput] = useState<boolean>(true);

  const [createExpense, {isLoading:isLoadingExpense}] = useCreateExpenseMutation();
  
  const [deleteTransaction, { isLoading:isLoadingDetected }] = useDeleteDetectedTransactionMutation();



  const [createOCR, {isLoading}] = useProcessReceiptMutation();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrResults, setOcrResults] = useState<OcrResult | null>(null);
  // const [errorMessage, setErrorMessage] = useState('');


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


  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: detectedId
      ? {
          amount: detectedAmountNumber,
          Description: detectedDescription,
          splitWith: [],
          paidBy: null,
          notes: detectedNotes,
          wallet: null,
          category: "",
          date:dateOnly || new Date(),
          time:timeOnly || new Date(),
          photo: null,
          Title: "",// these fields are just dummy fields to remove typescript errors
          recurring: false// these fields are just dummy fields to remove typescript errors
        }
      : {
          amount: 0,
          Description: "",
          splitWith: [],
          paidBy: null,
          notes: "",
          wallet: null,
          category: "",
          date: new Date(),
          time: new Date(),
          photo: null,
          Title: "",// these fields are just dummy fields to remove typescript errors
          recurring: false// these fields are just dummy fields to remove typescript errors
        },
  });
  
  
  const router = useRouter();
  const amount = watch("amount");
  const splitWith: { user_id: string, amount: number }[] = watch("splitWith");
  const TOLERANCE = 0.1;
  let invalidSubmit = !splitWith || splitWith.length == 0 || Math.abs(splitWith.reduce((sum, person) => sum + Number(person.amount), 0) - amount) > TOLERANCE || !validInput || splitWith.length === 1;

  // useEffect(() => {
  //   if (Object.keys(childErrors).length !== 0) {
  //     console.log("errors",errors)
  //     const messages = [
  //       childErrors.amount?.message,
  //       childErrors.Description?.message
  //     ].filter(Boolean).join("\n");
  
  //     Alert.alert("Invalid data", messages);
  //   }
  // }, [childErrors]);


  const pickImage = async (useCamera = false) => {
    let permissionResult;
    if (useCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow permission to access camera or gallery.');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 1 });

    if (!result.canceled && result.assets.length > 0) {
      console.log("Image picked");
      setImage(result.assets[0].uri);
      setOcrResults(null);
      setErrorMessage('');
      processReceipt();
    }
  };

  const processReceipt = async () => {
    console.log("Processing receipt...",image);
    if (!image) return;
    
    try {
      setLoading(true);
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await createOCR({ image: base64 }).unwrap();

      if (response.data && response.success) {
        if(response.data.amount && response.data.amount!== 0) {
          setValue("amount", response.data.amount);
        }
        if(response.data.vendor && response.data.vendor !== "") {
          setValue("Description", response.data.vendor);
        }
        if(response.data.date && response.data.date !== "") {
          setValue("date", new Date(response.data.date));
          setValue("time", new Date(response.data.date));
        }
        if(response.data.category && response.data.category !== "") {
          setValue("category", response.data.category);
        }
      }
    } catch (error) {
      console.log('Error processing receipt:', error);
      // setErrorMessage('Error processing receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      setValidInput(false);
    } else setValidInput(true);
  }, [childErrors]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);


  const onSubmit = async (data: Data) => {

    try {

      if(splitWith.length === 1) {
        Alert.alert("Invalid data", "Please select people to split with");
        return;
      }

      const totalSplit = splitWith?.reduce((sum, person) => sum + Number(person.amount), 0);
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
      formData.append("description", data.Description);
      formData.append("lenders", JSON.stringify([{ ...data.paidBy, amount: data.amount - amt }]));
      formData.append("borrowers", JSON.stringify(filteredSplit.map((user) => ({ ...user, amount: Number(user.amount) }))));

      if (data?.wallet?._id) {
        formData.append("wallet_id", data.wallet._id);
      }
      if(group_id) {
        formData.append("group_id", group_id);
      }
      formData.append("total_amount", String(data.amount));
      if (data?.category) {
        formData.append("expense_category", data.category);
      }
      if (data?.notes) {
        formData.append("notes", data.notes);
      }
      if (selectedImage) {
        const fileExtension = selectedImage.split(".").pop();
        const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
  
        formData.append("media", {
          uri: selectedImage,
          type: mimeType,
          name: `split-media.${fileExtension}`,
        } as any);
      }
      formData.append("created_at_date_time", String(created_at_date_time));
      const response = await createExpense(formData).unwrap();
      reset();
      router.replace({ pathname: "/view/viewExpense", params: { id:response?.data?._id} });
    } catch (error) {
      console.error("new expense failed to create:", error);
      const err = error as { data?: { message?: string } };
      setErrorMessage(err?.data?.message || "Something went wrong. Please try again.");
    }
  };  
  
  

  if(isLoadingExpense) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  return (
    <ScrollView style={globalStyles.viewContainer}>

      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>New Split</Text>
      </View>

      {group_name && (<Text style = {{fontWeight: "500", alignSelf: "center", fontSize: 18, marginVertical: 5}}>Adding in {group_name}</Text>)}

      <View style={styles.card}>
        <Text style={styles.title}>Scan Receipt</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
            <Text style={styles.buttonText}>📷 Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
            <Text style={styles.buttonText}>🖼️ Select Image</Text>
          </TouchableOpacity>
        </View>
      </View>
      {detectedId?(<AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors} childErrors = {childErrors}/>):(<AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors} childErrors = {childErrors}/>)}

      
      
      <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} group_id = {group_id} IncludePaidBy/>
      <NotesInput control={control} name="notes" />

      <View style={globalStyles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>

      <CategorySelector control={control} />

      <View style={[globalStyles.dateTimeContainer, {height: 100}]}>
        <CustomDateTimePicker control={control} name="date" label="Date" heading="Date" disableFutureDates/>
        <CustomDateTimePicker control={control} name="time" label="Time" heading="Time"/>
      </View>
      
      <CustomButton onPress={handleSubmit(onSubmit)} style={globalStyles.saveButton} disabled = {invalidSubmit}>Save</CustomButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { 
    fontSize: 18, 
    fontWeight: "bold",
    textAlign: "center", 
    marginBottom: 5 
  },
  button: { 
    backgroundColor: "#355C7D", 
    padding: 10, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  card: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }
});

