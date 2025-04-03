import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter,useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import SplitWithSelector from "@/components/peopleSelectors/SplitWithSelector";
import NotesInput from "@/components/inputs/NotesInput";
import WalletSelector from "@/components/selectors/WalletSelector";
import PhotoSelector from "@/components/selectors/PhotoSelector";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import CategorySelector from "@/components/selectors/CategorySelector";
import { useCreateExpenseMutation } from "@/store/expenseApi";
import { useGetWalletQuery } from "@/store/walletApi";
import {useUpdateSettlementMutation,useGetSettlementQuery} from '@/store/settlementApi';
export default function AddSettlementScreen() {
  let {id} = useLocalSearchParams();
//   let status = "receiver";
//   if(fetched_amount<0){
//     fetched_amount=fetched_amount*-1;
//     status = "sent";
//   }


    const { data:settlementData, isLoading:settlementIsLoading, error:settlementError, refetch } = useGetSettlementQuery(id);
    let walletData, walletIsLoading, walletError;

    if(settlementData.data.payer_wallet_id){
            ({ data: walletData, isLoading: walletIsLoading, error: walletError } = useGetWalletQuery(settlementData.data.payer_wallet_id));
    }
    else if(settlementData.data.receiver_wallet_id){
        ({ data: walletData, isLoading: walletIsLoading, error: walletError } = useGetWalletQuery(settlementData.data.receiver_wallet_id));

    }
  const [updateSettlement, {isLoading}] = useUpdateSettlementMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount:settlementData.data.amount,
      Description: settlementData.data.settlement_description,
      wallet: walletData?.data,
      photo: null,
    },
  });
  
  const router = useRouter();
  const amount = watch("amount");

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

const onSubmit = async (data: any) => {

  try {
    if(settlementData.data.settlement_description!==data.Description){
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
  
return (
  // <View style={[{flex:1}]}>
    <ScrollView style={styles.container}>

        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
            <Text style={styles.header}>Edit Settlement</Text>
      </View>

      <AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors}/>
      {/* <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} IncludePaidBy/> */}
      
      <View style={styles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet" isFrozen={true}/>
        <PhotoSelector control={control} />
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
    marginTop: 50,
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