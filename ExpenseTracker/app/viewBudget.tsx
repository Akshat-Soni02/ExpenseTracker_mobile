// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { useRouter } from "expo-router";
// import { FontAwesome } from "@expo/vector-icons";
// import CustomButton from "@/components/button/CustomButton";
// import AmountDescriptionInput from "@/components/AmountDescriptionInput";
// // import SplitWithSelector from "@/components/SplitWithSelector";
// // import NotesInput from "@/components/NotesInput";
// // import WalletSelector from "@/components/WalletSelector";
// // import PhotoSelector from "@/components/PhotoSelector";
// // import CustomDateTimePicker from "@/components/CustomDateTimePicker";
// import CategorySelector from "@/components/CategorySelector";
// import PeriodSelector from "@/components/PeriodSelector";
// import { useUpdateBudgetMutation ,useGetBudgetQuery} from "@/store/budgetApi";
// import { useLocalSearchParams } from "expo-router";

// export default function ViewBudgetScreen() {
//     const { id } = useLocalSearchParams();

//   const [updateBudget, {isLoading}] = useUpdateBudgetMutation();
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const {data: dataBudget, isLoading: isLoadingBudget, error: errorBudget,refetch} = useGetBudgetQuery(id);

//   const { control, handleSubmit, watch, setValue, reset } = useForm({
//     defaultValues: {
//       amount: null,
//       budget_title: "",
//       budget_category: "",
//       period:"monthly",
//     },
//   });
  
//   const router = useRouter();
//   const amount = watch("amount");

//   const TOLERANCE = 0.1;


//   // description,
//   // lenders,
//   // borrowers,
//   // wallet_id,
//   // total_amount,
//   // expense_category,
//   // notes,
//   // group_id,
//   // created_at_date_time,
// const onSubmit = async (data: any) => {

  
//     if(isEditing){
//       try {
//         console.log("data Description:",data.Description);
//         const response = await updateBudget({
//           id: id,
//           body: {
//             budget_title: data.Description,
//             amount: data.amount,
//             budget_category: data?.category,
//             period: data?.period,
//           },
//         }).unwrap();
        
//      } 
//      catch (error) {
//     console.error("failed to update budget:", error);
//     const err = error as { data?: { message?: string } };
//     }
//     setIsEditing(!isEditing);
//   console.log("isEditing:" ,isEditing);
//     if (err?.data?.message) {
//       setErrorMessage(err.data.message);
//     } 
//     else {
//       setErrorMessage("Something went wrong. Please try again.");
//     }
    
//   await refetch();
//   }
//   else{
//     setIsEditing(!isEditing);
//   }
// };
// if (isLoadingBudget) {
//     return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
// }
  
// if (errorBudget) {
//     return <Text>Error: {errorBudget?.message || JSON.stringify(errorBudget)}</Text>;
// }

//   return (
//     <ScrollView style={styles.container}>

//         <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <FontAwesome name="arrow-left" size={20} color="black" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.headerText}>
//           <FontAwesome name={isEditing ? "check" : "pencil"} size={30} color="black" />
//         </TouchableOpacity>    
//       </View>

//     {!isEditing?(<View style={styles.amountDescriptionContainer}>
//           <Text style={styles.label}>Amount</Text>
//           <View style={styles.amountWrapper}>
//             <Text style={styles.currency}>₹</Text>
//                 <Text style={styles.amountInput}>{dataBudget.data.amount}</Text>
//           </View>
//           <View style={styles.separator} />
    
//           {/* Description Section */}
//           <Text style={styles.label}>Description</Text>
//                 <Text style={styles.descriptionInput}>{dataBudget.data.budget_title}</Text>
//         </View>):
//       <AmountDescriptionInput control={control} label="Description"/>}


//        {!isEditing ? (<View style={styles.categoryContainer}>
//             <Text style={[styles.label,{alignSelf:"center"}]}>Category</Text>
//                 <View style={styles.selectionContainer}>
//                     <TouchableOpacity style={styles.button}>
//                         <Text>{dataBudget.data.budget_category}</Text>
//                     </TouchableOpacity>
//                 </View>
//         </View>):
    
//       <CategorySelector control={control} /> }


//       {!isEditing?(<View style={styles.categoryContainer}>
//             <Text style={[styles.label,{alignSelf:"center"}]}>Period</Text>
//                 <View style={styles.selectionContainer}>
//                     <TouchableOpacity style={styles.button}>
//                         <Text>{dataBudget.data.period}</Text>
//                     </TouchableOpacity>
//                 </View>
//         </View>):
//       <PeriodSelector control={control}/>}

//       {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
//       {/* <CustomButton onPress={handleSubmit(onSubmit)} style={styles.button}>Save</CustomButton> */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     backgroundColor: "#fff",
//   },
//   headerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 50,
//     marginBottom: 20
//   },
//   backButton: {
//     padding: 10,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     fontFamily: "Poppins_700Bold",
//   },
//   walletPhotoContainer: {
//     flexDirection: "row",
//     // gap: 1,
//     width: "100%",
//     height: 130,
//     justifyContent: "space-between"
//   },
//   dateTimeContainer: {
//     flexDirection: "row",
//     // gap: 1,
//     width: "100%",
//     height: 100,
//     justifyContent: "space-between"
//   },
//   button: {
//     marginVertical: 15,
//     alignSelf: "center",
//   },
//   error: {
//     color: "red",
//     fontSize: 12,
//     marginBottom: 10,
//   },
//   amountDescriptionContainer: {
//     borderWidth: 2,
//     borderColor: "rgba(255, 255, 255, 0.2)", 
//     backgroundColor: "rgba(200, 230, 255, 0.4)",
//     // rgba(200, 230, 255, 0.4)
//     borderRadius: 15,
//     padding: 20,
//     alignItems: "center",
//     width: "100%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     overflow: "hidden",
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: "bold",
//     fontFamily: "Poppins_700Bold",
//     color: "#000",
//     marginBottom: 5,
//   },
//   amountWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   currency: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginRight: 5,
//     fontFamily: "Poppins_700Bold",
//     color: "#000",
//   },
//   amountInput: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     fontFamily: "Poppins_700Bold",
//     color: "#000",
//   },
//   separator: {
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(5, 5, 5, 0.3)",
//     width: "50%",
//     marginVertical: 5,
//   },
//   descriptionInput: {
//     fontSize: 16,
//     textAlign: "center",
//     fontFamily: "Poppins_400Regular",
//     color: "#000",
//   },
//   placeholderText: {
//     color: "#A0AEC0",
//     fontStyle: "italic",
//   },
//   categoryContainer: {
//     borderWidth: 2,
//     borderRadius: 15,
//     backgroundColor: "rgba(200, 230, 255, 0.4)",
//     borderColor: "rgba(255, 255, 255, 0.2)",
//     padding: 10,
//   },
// });

//

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useUpdateBudgetMutation, useGetBudgetQuery } from "@/store/budgetApi";
import { useLocalSearchParams } from "expo-router";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import CategorySelector from "@/components/CategorySelector";
import PeriodSelector from "@/components/PeriodSelector";
import { useForm } from "react-hook-form";

export default function ViewBudgetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [updateBudget, { isLoading }] = useUpdateBudgetMutation();
  const { data: dataBudget, isLoading: isLoadingBudget, error: errorBudget, refetch } = useGetBudgetQuery(id);

  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      amount: "",
      budget_title: "",
      budget_category: "",
      period: "monthly",
    },
  });

  // Reset form with default values when switching to edit mode
  useEffect(() => {
    if (isEditing && dataBudget) {
      reset({
        amount: dataBudget.data.amount.toString(), // Convert to string if necessary
        budget_title: dataBudget.data.budget_title,
        budget_category: dataBudget.data.budget_category,
        period: dataBudget.data.period,
      });
    }
  }, [isEditing, dataBudget, reset]);

  const onSubmit = async (data: any) => {
    if (isEditing) {
      try {
        await updateBudget({
          id,
          body: {
            budget_title: data.budget_title,
            amount: parseFloat(data.amount), // Ensure numeric conversion
            budget_category: data.budget_category,
            period: data.period,
          },
        }).unwrap();
      } catch (error) {
        console.error("Failed to update budget:", error);
        setErrorMessage("Something went wrong. Please try again.");
      }
      setIsEditing(false);
      await refetch();
    } else {
      setIsEditing(true);
    }
  };

  if (isLoadingBudget) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (errorBudget) {
    return <Text style={styles.errorMessage}>Error: {errorBudget?.message || JSON.stringify(errorBudget)}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.headerButton}>
          <FontAwesome name={isEditing ? "check" : "pencil"} size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* View Mode */}
      {!isEditing ? (
        <View style={styles.card}>
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.amount}>₹{dataBudget.data.amount}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{dataBudget.data.budget_title}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{dataBudget.data.budget_category}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Period</Text>
            <Text style={styles.value}>{dataBudget.data.period}</Text>
          </View>
        </View>
      ) : (
        <>
          <AmountDescriptionInput control={control} name="budget_title" label="Description" />
          <CategorySelector control={control} name="budget_category" />
          <PeriodSelector control={control} name="period" />
        </>
      )}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F5F7FA", 
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerButton: {
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 18,
    color: "#555",
    marginTop: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  errorMessage: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});