import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
export default function AddSettlementScreen() {
  let {fetched_amount,receiver_id,name} = useLocalSearchParams();
  let status = "receiver";
  if(fetched_amount<0){
    fetched_amount=fetched_amount*-1;
    status = "sent";
  }
  console.log(fetched_amount);
  const [createSettlement, {isLoading}] = useCreateSettlementMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount:fetched_amount,
      description: "",
      wallet: "",
      photo: null,
    },
  });
  
  const router = useRouter();
  const amount = watch("amount");
  const splitWith = watch("splitWith");

  const TOLERANCE = 0.1;


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
    if(status=="sent"){
      
      const response = await createSettlement({
          settlement_description: data.Description,
          payer_wallet_id: data?.wallet,
          receiver_id:receiver_id,
          amount: fetched_amount,
          status:status,
        // filePath: data?.photo?._j

      }).unwrap();
    }
    else{
      const response = await createSettlement({
          settlement_description: data.Description,
          receiver_wallet_id: data?.wallet,
          payer_id:receiver_id,
          amount: fetched_amount,
          status:status,
          // filePath: data?.photo?._j
      }).unwrap();
    }
    reset();
    router.replace("/(tabs)/people");
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
  
return (
  <View style={[{flex:1}]}>
    <ScrollView style={styles.container}>

        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        {status==="sent"?<Text style={styles.header}>You owe {name}</Text>:<Text style={styles.header}>{name} owes you</Text>}
      </View>

      <AmountDescriptionInput control={control} label="Description" isAmountFrozen={true}/>
      {/* <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} IncludePaidBy/> */}
      
      <View style={styles.walletPhotoContainer}>
        <WalletSelector control={control} name="wallet"/>
        <PhotoSelector control={control} />
      </View>
      
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </ScrollView>
    
          <CustomButton onPress={handleSubmit(onSubmit)} style={styles.button}>Settle</CustomButton>
          </View>
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