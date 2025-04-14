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
    <View style={globalStyles.viewContainer}>

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

      <View style={globalStyles.viewActivityDetailContainer}>

        <Text style={globalStyles.viewActivityTitle}>{transaction?.description}</Text>
        <Text style={[globalStyles.viewActivityAmount, { color: themeColor }]}>₹{transaction?.amount}</Text>

        {transaction?.wallet_id && (
          <Text style={globalStyles.viewActivityAccountName}>Wallet: {walletData?.data?.wallet_title || "Unknown"}</Text>
        )}

        <Text style={globalStyles.viewActivityDate}>{moment(transaction?.created_at_date_time).format("DD MMM YYYY, hh:mm A")}</Text>
      </View>

      {transaction?.notes && (
        <View style={globalStyles.viewActivityNotesContainer}>
          <Text style={globalStyles.viewActivityNotesTitle}>Notes</Text>
          <Text style={globalStyles.viewActivityNotesText}>{transaction.notes}</Text>
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
});