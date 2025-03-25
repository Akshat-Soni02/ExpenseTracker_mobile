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
      Description: "",
      category: "",
      period: "monthly",
    },
  });

  // Reset form with default values when switching to edit mode
  useEffect(() => {
    if (isEditing && dataBudget) {
      reset({
        amount: dataBudget.data.amount.toString(), // Convert to string if necessary
        Description: dataBudget.data.budget_title,
        category: dataBudget.data.budget_category,
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
            budget_title: data.Description,
            amount: parseFloat(data.amount), // Ensure numeric conversion
            budget_category: data.category,
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
            <Text style={[styles.label,{fontSize:25}]}>Current Spend</Text>
            <Text style={[styles.amount   , { color: dataBudget.data.current_spend >= dataBudget.data.amount ? 'red' : 'green' }]}>₹{dataBudget.data.current_spend}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Limit</Text>
            <Text style={[styles.amount,{color:"#555",fontSize:20}]}>₹{dataBudget.data.amount}</Text>
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
          <AmountDescriptionInput control={control} label="Description" />
          <CategorySelector control={control}/>
          <PeriodSelector control={control}/>
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