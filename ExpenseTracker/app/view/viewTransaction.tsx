import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import FastImage from 'react-native-fast-image';
import moment from "moment";

import { useLazyGetWalletQuery } from "@/store/walletApi";
import { useGetPersonalTransactionQuery,useDeletePersonalTransactionMutation } from "@/store/personalTransactionApi";
import { globalStyles } from "@/styles/globalStyles";


const TransactionDetailScreen = () => {

  const { id } = useLocalSearchParams() as {id: string};

  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data, isLoading, error, refetch } = useGetPersonalTransactionQuery(id);
  const [getWallet, { data: walletData }] = useLazyGetWalletQuery();
  const [deleteTransaction, {isLoading: deleteLoading, error: deleteError}] = useDeletePersonalTransactionMutation();
  

  const transaction = data?.data;

  useEffect(() => {
    if (transaction?.media?.url) {
      setImageUrl(transaction.media.url);
    }
  }, [transaction?.media?.url]);


  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  useEffect(() => {
    if (transaction?.wallet_id) {
      getWallet(transaction.wallet_id);
    }
  }, [transaction?.wallet_id]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);

  const handleTransactionDelete = async () => {
    try {
      const response = await deleteTransaction(id);
      router.back();
    } catch (error) {
      console.log(error);
      const err = error as { data?: { message?: string } };
      if (err?.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  if (isLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (error) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in error) {
      errorMessage = `Server Error: ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      errorMessage = `Client Error: ${error.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  if (!data?.data) return <Text>No transaction found</Text>;

  const themeColor = transaction?.transaction_type === "income" ? "#10B981" : "#EF4444";

  return (
    <View style={[styles.container]}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <Entypo name="dots-three-vertical" size={20} color="black" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => {setMenuVisible(false);router.push({pathname:"/action/edit/editTransaction",params:{fetchedId:id}})}} title="Edit" />
          <Divider />
          <Menu.Item onPress={() => Alert.alert(
                      "Delete spend", 
                      `Are you sure you want to delete ${transaction?.description}`, 
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Yes", onPress: () => handleTransactionDelete()}
                      ]
                    )} title="Delete" />
        </Menu>
      </View>

      <View style={styles.detailContainer}>

        <Text style={styles.title}>{transaction?.description}</Text>
        <Text style={[styles.amount, { color: themeColor }]}>₹{transaction?.amount}</Text>

        {transaction?.wallet_id && (
          <Text style={styles.accountName}>Wallet: {walletData?.data?.wallet_title || "Unknown"}</Text>
        )}

        <Text style={styles.date}>{moment(transaction?.created_at_date_time).format("DD MMM YYYY, hh:mm A")}</Text>
      </View>

      {transaction?.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>{transaction.notes}</Text>
        </View>
      )}

      {imageUrl && (
        <View style={styles.mediaContainer}>
          <FastImage
            style={styles.previewImage}
            source={{ uri: imageUrl }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}
      
    </View>
  );
};

export default TransactionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  mediaContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: "contain",
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