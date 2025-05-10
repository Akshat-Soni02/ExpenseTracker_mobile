import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import { useRouter,useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import WalletSelector from "@/components/selectors/WalletSelector";
import PhotoSelector from "@/components/selectors/PhotoSelector";
import { useGetWalletQuery } from "@/store/walletApi";
import {useUpdateSettlementMutation,useGetSettlementQuery} from '@/store/settlementApi';
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";

export type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Description?: error;
}

type Data = {
  Description: string;
  wallet?: {_id: string} | null;
  // photo?: string;
}

export default function EditSettlementScreen() {
  const router = useRouter();
  let { id } = useLocalSearchParams() as { id: string };

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [childErrors, setChildErrors] = useState<ChildErrors>({});

  const [updateSettlement, { isLoading }] = useUpdateSettlementMutation();
  const { data: settlementData, isLoading: settlementIsLoading, error: settlementError, refetch } = useGetSettlementQuery(id);

  let walletData, walletIsLoading, walletError;
  if(settlementData?.data.payer_wallet_id){
          ({ data: walletData, isLoading: walletIsLoading, error: walletError } = useGetWalletQuery(settlementData.data.payer_wallet_id));
  }
  else if(settlementData?.data.receiver_wallet_id){
      ({ data: walletData, isLoading: walletIsLoading, error: walletError } = useGetWalletQuery(settlementData.data.receiver_wallet_id));
  }

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount:settlementData?.data.amount || 0,
      Description: settlementData?.data.settlement_description || "",
      wallet: walletData?.data,
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

const onSubmit = async (data: Data) => {
  try {

    if(settlementData?.data.settlement_description !== data.Description){
      const response = await updateSettlement({id:id,body:{
        settlement_description: data.Description,
      },
      }).unwrap();
    }
    router.back();
  } catch (error) {
    console.error("failed to update Settlement:", error);
    const err = error as { data?: { message?: string } };
    if (err?.data?.message) {
      setErrorMessage(err.data.message);
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }
};

if(isLoading || settlementIsLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

if (settlementError) {
  let errorMessage = "An unknown error occurred";

  if ("status" in settlementError) {
    errorMessage = `Server Error: ${JSON.stringify(settlementError.data)}`;
  } else if ("message" in settlementError) {
    errorMessage = `Client Error: ${settlementError.message}`;
  }
  return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
}
  
return (
    <ScrollView style={globalStyles.viewContainer}>

       <Header headerText="Edit Settlement"/>

      <AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors}/>
      
      <View style={globalStyles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet" isFrozen={true}/>
        <PhotoSelector control={control} />
      </View>
      
      <CustomButton onPress={handleSubmit(onSubmit)} style={globalStyles.saveButton}>Save</CustomButton>
    </ScrollView>          
  );
}