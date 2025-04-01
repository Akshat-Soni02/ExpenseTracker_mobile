import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import { useGetWalletQuery,useDeleteWalletMutation } from "@/store/walletApi";

const WalletDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetWalletQuery(id);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteWallet, {isLoading:isLoadingDelete}] = useDeleteWalletMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const wallet = data?.data;

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  if (isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  if (error) return <Text>Error loading wallet details</Text>;
  if (!data?.data) return <Text>No wallet found</Text>;



  const themeColor = wallet.lower_limit <= wallet.amount ? "#10B981" : "#EF4444";

  const onDelete = async () => {
    try {
      await deleteWallet(id);
      router.push("/(tabs)/wallets");
    } catch (error) {
      console.error("wallet failed to delete:", error);
        const err = error as { data?: { message?: string } };
        if (err?.data?.message) {
          setErrorMessage(err.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        {/* Menu Component */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <Entypo name="dots-three-vertical" size={20} color="black" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => {setMenuVisible(false);router.push({pathname:"/action/edit/editWallet",params:{fetchedId:id,fetchedAmount:wallet.amount,fetchedName:wallet.wallet_title,fetchedLowerLimit:wallet.lower_limit}})}} title="Edit" />
          <Divider />
          <Menu.Item onPress={() => Alert.alert(
                                "Delete wallet", 
                                `Are you sure you want to delete ${wallet.wallet_title}`, 
                                [
                                  { text: "Cancel", style: "cancel" },
                                  { text: "Yes", onPress: () => onDelete()}
                                ]
                              )} title="Delete" />
        </Menu>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.title}>{wallet.wallet_title}</Text>
        <Text style={[styles.amount, { color: themeColor }]}>₹{wallet.amount}</Text>
        {wallet.lower_limit && (<Text style={styles.date}>Lower limit : {wallet.lower_limit}</Text>)}
      </View>
    </View>
  );
};

export default WalletDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  menuButton: {
    padding: 10,
  },
  detailContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
  },
  amount: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
  },
  accountName: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  date: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: "#9CA3AF",
  },
  notesContainer: {
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  notesTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#374151",
  },
  notesText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  splitContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 15,
  },
  paidBy: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#374151",
    marginBottom: 5,
  },
  oweText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#6B7280",
  },
  boldText: {
    fontFamily: "Poppins_700Bold",
  },
});