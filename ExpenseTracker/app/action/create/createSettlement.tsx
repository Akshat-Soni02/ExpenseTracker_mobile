import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter,useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import WalletSelector from "@/components/selectors/WalletSelector";
import PhotoSelector from "@/components/selectors/PhotoSelector";
import { useCreateSettlementMutation } from '@/store/settlementApi';
import { globalStyles } from "@/styles/globalStyles";
export type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Description?: error;
}

type LocalParams = {
  fetched_amount: string;
  receiver_id: string;
  name: string;
  group_id?: string;
  group_name?: string;
}

type Data = {
  Description: string;
  wallet?: {_id: string} | null;
  // photo?: string;
}

export default function AddSettlementScreen() {
  let {fetched_amount, receiver_id, name, group_id, group_name} = useLocalSearchParams() as LocalParams;

  const [createSettlement, {isLoading}] = useCreateSettlementMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});
  const [validInput, setValidInput] = useState<boolean>(true);

  const router = useRouter();

  let status = "receiver";
  let fetched_amount_number = Number(fetched_amount);
  if(fetched_amount_number<0){
    fetched_amount_number=fetched_amount_number*-1;
    status = "sent";
  }

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      amount: fetched_amount_number,
      Description: "",
      wallet: null,
      photo: null,
    },
  });
  
  // useEffect(() => {
  //   if (Object.keys(childErrors).length !== 0) {
  //     const messages = [
  //       childErrors.amount?.message,
  //       childErrors.Description?.message
  //     ].filter(Boolean).join("\n");
  //     Alert.alert("Invalid data", messages);
  //   }
  // }, [childErrors]);

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
      console.log("settlement create Data: ", data);
      let response = null;
      if(status=="sent"){
        response = await createSettlement({
            settlement_description: data.Description,
            payer_wallet_id: data?.wallet?._id || undefined,
            receiver_id:receiver_id,
            amount: fetched_amount_number,
            status: status,
            group_id: group_id,
          // filePath: data?.photo?._j

        }).unwrap();
      }
      else{
        response = await createSettlement({
            settlement_description: data.Description,
            receiver_wallet_id: data?.wallet?._id || undefined,
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

        <AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors} childErrors={childErrors}/>
        
        <View style={globalStyles.walletPhotoContainer}>
          <WalletSelector control={control} name="wallet"/>
          <PhotoSelector control={control} />
        </View>
        
        <CustomButton onPress={handleSubmit(onSubmit)} style={globalStyles.saveButton} disabled={!validInput}>Settle</CustomButton>
      </ScrollView>
    );
  }

const styles = StyleSheet.create({
  groupName:{
    alignSelf:"center",
    fontSize:20,
  }
});