import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter,useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import SplitWithSelector from "@/components/SplitWithSelector";
import NotesInput from "@/components/NotesInput";
import WalletSelector from "@/components/WalletSelector";
import PhotoSelector from "@/components/PhotoSelector";
import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CategorySelector from "@/components/CategorySelector";
import { useCreateExpenseMutation } from "@/store/expenseApi";
import {useCreateSettlementMutation} from '@/store/settlementApi';
import { globalStyles } from "@/styles/globalStyles";
export default function AddSettlementScreen() {
  let {fetched_amount,receiver_id,name,group_id,group_name} = useLocalSearchParams();
  let status = "receiver";
  let fetched_amount_number = Number(fetched_amount);
  if(fetched_amount_number<0){
    fetched_amount_number=fetched_amount_number*-1;
    status = "sent";
  }
  const [createSettlement, {isLoading}] = useCreateSettlementMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount:fetched_amount_number,
      description: "",
      wallet: "",
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
    let response = null;
    if(status=="sent"){
      response = await createSettlement({
          settlement_description: data.Description,
          payer_wallet_id: data?.wallet || undefined,
          receiver_id:receiver_id,
          amount: fetched_amount_number,
          status:status,
          group_id:group_id,
        // filePath: data?.photo?._j

      }).unwrap();
    }
    else{
      response = await createSettlement({
          settlement_description: data.Description,
          receiver_wallet_id: data?.wallet || undefined,
          payer_id:receiver_id,
          amount: fetched_amount_number,
          status:status,
          group_id:group_id,
          // filePath: data?.photo?._j
      }).unwrap();
    }
    reset();
    router.replace({ pathname: "/view/viewSettlement", params: { id:response?.data?._id} });
  } catch (error) {
    console.error("new settlement failed to create:", error);
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
  // <View style={[{flex:1}]}>
    <ScrollView style={globalStyles.viewContainer}>

        <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        {status==="sent"?<Text style={globalStyles.headerText}>Paid to {name}</Text>:<Text style={globalStyles.headerText}>Received from {name}</Text>}
      </View>
      {group_name && <Text style={styles.groupName}> in {group_name}</Text>}
      <AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors}/>
      {/* <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} IncludePaidBy/> */}
      
      <View style={globalStyles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>
      
      {errorMessage && (Alert.alert("Error",errorMessage))}
      <CustomButton onPress={handleSubmit(onSubmit)} style={globalStyles.saveButton}>Settle</CustomButton>
    </ScrollView>
    
          
          // </View>
  );
}

const styles = StyleSheet.create({
  groupName:{
    alignSelf:"center",
    fontSize:20,
  }
});