import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
// import SplitWithSelector from "@/components/SplitWithSelector";
// import NotesInput from "@/components/NotesInput";
// import WalletSelector from "@/components/WalletSelector";
// import PhotoSelector from "@/components/PhotoSelector";
// import CustomDateTimePicker from "@/components/CustomDateTimePicker";
import CategorySelector from "@/components/CategorySelector";
import PeriodSelector from "@/components/PeriodSelector";
import { useUpdateBudgetMutation ,useGetBudgetQuery} from "@/store/budgetApi";
import { useLocalSearchParams } from "expo-router";

export default function ViewBudgetScreen() {
    const { id } = useLocalSearchParams();

  const [updateBudget, {isLoading}] = useUpdateBudgetMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const {data: dataBudget, isLoading: isLoadingBudget, error: errorBudget,refetch} = useGetBudgetQuery(id);

  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      amount: null,
      budget_title: "",
      budget_category: "",
      period:"monthly",
    },
  });
  
  const router = useRouter();
  const amount = watch("amount");

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

  
    if(isEditing){
      try {
        console.log("data Description:",data.Description);
        const response = await updateBudget({
          id: id,
          body: {
            budget_title: data.Description,
            amount: data.amount,
            budget_category: data?.category,
            period: data?.period,
          },
        }).unwrap();
        
     } 
     catch (error) {
    console.error("failed to update budget:", error);
    const err = error as { data?: { message?: string } };
    }
    setIsEditing(!isEditing);
  console.log("isEditing:" ,isEditing);
    if (err?.data?.message) {
      setErrorMessage(err.data.message);
    } 
    else {
      setErrorMessage("Something went wrong. Please try again.");
    }
    
  await refetch();
  }
  else{
    setIsEditing(!isEditing);
  }
};
if (isLoadingBudget) {
    return <Text>Loading...</Text>;
}
  
if (errorBudget) {
    return <Text>Error: {errorBudget?.message || JSON.stringify(errorBudget)}</Text>;
}

  return (
    <ScrollView style={styles.container}>

        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.headerText}>
          <FontAwesome name={isEditing ? "check" : "pencil"} size={30} color="black" />
        </TouchableOpacity>    
      </View>

    {!isEditing?(<View style={styles.amountDescriptionContainer}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountWrapper}>
            <Text style={styles.currency}>₹</Text>
                <Text style={styles.amountInput}>{dataBudget.data.amount}</Text>
          </View>
          <View style={styles.separator} />
    
          {/* Description Section */}
          <Text style={styles.label}>Description</Text>
                <Text style={styles.descriptionInput}>{dataBudget.data.budget_title}</Text>
        </View>):
      <AmountDescriptionInput control={control} label="Description"/>}


       {!isEditing ? (<View style={styles.categoryContainer}>
            <Text style={[styles.label,{alignSelf:"center"}]}>Category</Text>
                <View style={styles.selectionContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text>{dataBudget.data.budget_category}</Text>
                    </TouchableOpacity>
                </View>
        </View>):
    
      <CategorySelector control={control} /> }


      {!isEditing?(<View style={styles.categoryContainer}>
            <Text style={[styles.label,{alignSelf:"center"}]}>Period</Text>
                <View style={styles.selectionContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text>{dataBudget.data.period}</Text>
                    </TouchableOpacity>
                </View>
        </View>):
      <PeriodSelector control={control}/>}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {/* <CustomButton onPress={handleSubmit(onSubmit)} style={styles.button}>Save</CustomButton> */}
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
  },
  amountDescriptionContainer: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)", 
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    // rgba(200, 230, 255, 0.4)
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: "hidden",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins_700Bold",
    color: "#000",
    marginBottom: 5,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  currency: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 5,
    fontFamily: "Poppins_700Bold",
    color: "#000",
  },
  amountInput: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    color: "#000",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(5, 5, 5, 0.3)",
    width: "50%",
    marginVertical: 5,
  },
  descriptionInput: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },
  placeholderText: {
    color: "#A0AEC0",
    fontStyle: "italic",
  },
  categoryContainer: {
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
  },
});