import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome ,Entypo} from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {Menu, Divider } from "react-native-paper";

import { useGetBudgetQuery,useDeleteBudgetMutation } from "@/store/budgetApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";


export default function ViewBudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams() as {id: string};
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: dataBudget, isLoading: isLoadingBudget, error: errorBudget, refetch } = useGetBudgetQuery(id);
  const [deleteBudget, {isLoading: deleteLoading, error: deleteError}] = useDeleteBudgetMutation();

  
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);

  const getUsageColor = (usage: number) => {
    if (usage < 0.8) return "green";
    if (usage < 1) return "#FFA500"; // orange
    return "red";
  };
  

  const handleBudgetDelete = async () => {
    try {
      const response = await deleteBudget(id);
      router.back();
    } catch (error) {
      console.log("Error deleting budget", error);
      const err = error as { data?: { message?: string } };
      if (err?.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  if (isLoadingBudget || deleteLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (errorBudget) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in errorBudget) {
      errorMessage = `Server Error: ${JSON.stringify(errorBudget.data)}`;
    } else if ("message" in errorBudget) {
      errorMessage = `Client Error: ${errorBudget.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  return (
    <ScrollView style={globalStyles.viewContainer}>
      <Header
        headerIcon={
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                <Entypo name="dots-three-vertical" size={20} color="black" />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                router.push({ pathname: "/action/edit/editBudget", params: { id: id } });
              }}
              title="Edit"
            />
            <Divider />
            <Menu.Item
              onPress={() =>
                Alert.alert("Delete Budget", `Are you sure you want to delete "${dataBudget?.data.budget_title}"?`, [
                  { text: "Cancel", style: "cancel" },
                  { text: "Yes", onPress: () => handleBudgetDelete() },
                ])
              }
              title="Delete"
            />
          </Menu>
        }
      />

      <View style={styles.card}>

      <Text style={styles.cardTitle}>{dataBudget?.data.budget_title}</Text>

      <View style={styles.analyticsBox}>
        <Text style={styles.label}>Spend</Text>
        <Text style={[styles.value, { color: getUsageColor(dataBudget!.data.current_spend / dataBudget!.data.amount) }]}>
          ₹{dataBudget?.data.current_spend}
        </Text>
      </View>

      <View style={styles.analyticsBox}>
        <Text style={styles.label}>Limit</Text>
        <Text style={styles.value}>₹{dataBudget?.data.amount}</Text>
      </View>

      <View style={styles.analyticsBox}>
        <Text style={styles.label}>Remaining</Text>
        <Text style={styles.value}>
          ₹{(dataBudget!.data.amount - dataBudget!.data.current_spend).toFixed(2)}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(dataBudget!.data.current_spend / dataBudget!.data.amount) * 100}%`,
              backgroundColor: getUsageColor(dataBudget!.data.current_spend / dataBudget!.data.amount),
            },
          ]}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{dataBudget?.data.budget_category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Period</Text>
        <Text style={styles.value}>{dataBudget?.data.period}</Text>
      </View>

      </View>

    </ScrollView>

  );
}


const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
  },
  budgetSection: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  budgetHeader: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 28,
    fontWeight: "500",
    marginBottom: 4,
  },
  budgetLimit: {
    fontSize: 14,
    color: "#757575",
  },
  infoBlock: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#212121",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },



  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  section: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
    textAlign: "center",
  },
  
  analyticsBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  
  progressBarContainer: {
    height: 10,
    backgroundColor: "#E5E5E5",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 15,
  },
  
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },  
  
});
