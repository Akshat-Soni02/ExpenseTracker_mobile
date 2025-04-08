import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome ,Entypo} from "@expo/vector-icons";
import { useUpdateBudgetMutation, useGetBudgetQuery,useDeleteBudgetMutation } from "@/store/budgetApi";
import { useLocalSearchParams } from "expo-router";
import AmountDescriptionInput from "@/components/AmountDescriptionInput";
import CategorySelector from "@/components/CategorySelector";
import PeriodSelector from "@/components/PeriodSelector";
import { useForm } from "react-hook-form";
import {Menu, Divider } from "react-native-paper";
import { globalStyles } from "@/styles/globalStyles";

export default function ViewBudgetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [updateBudget, { isLoading }] = useUpdateBudgetMutation();
  const { data: dataBudget, isLoading: isLoadingBudget, error: errorBudget, refetch } = useGetBudgetQuery(id);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteBudget, {isLoading: deleteLoading, error: deleteError}] = useDeleteBudgetMutation();

  // const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [childErrors, setChildErrors] = useState({});
  useEffect(() => {
      if (id) {
        refetch();
      }
    }, [id]);
const handleBudgetDelete = async () => {
          try {
            const response = await deleteBudget(id);
            console.log("bill deleting response",response);
            if(!response || deleteError) {
              console.log(error);
            }
            router.back();
          } catch (error) {
            
          }
        }
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
    <ScrollView style={globalStyles.viewContainer}>
      {/* Header */}
      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={globalStyles.menuButton}>
              <Entypo name="dots-three-vertical" size={20} color="black" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => {setMenuVisible(false);router.push({pathname:"/action/edit/editBudget",params : {id:id}})}} title="Edit" />
          <Divider />
          <Menu.Item onPress={() => Alert.alert(
                        "Delete bill", 
                        `Are you sure you want to delete ${dataBudget.data.budget_title}`, 
                        [
                          { text: "Cancel", style: "cancel" },
                          { text: "Yes", onPress: () => handleBudgetDelete()}
                        ]
                      )} title="Delete" />
        </Menu>
      </View>

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

      {errorMessage && (Alert.alert("Error",errorMessage))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
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
});