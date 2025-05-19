import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import FastImage from 'react-native-fast-image';
import moment from "moment";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ImageViewing from 'react-native-image-viewing';

import { useLazyGetWalletQuery } from "@/store/walletApi";
import { useGetPersonalTransactionQuery,useDeletePersonalTransactionMutation } from "@/store/personalTransactionApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";


const TransactionDetailScreen = () => {

  const { id } = useLocalSearchParams() as {id: string};

  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [viewImage, setViewImage] = useState(false);

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

  const themeColor = transaction?.transaction_type === "income" ? "#1e9738" : "#d86161";

  return (
    <View style={globalStyles.viewContainer}>

      <Header headerIcon={<Menu
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
        </Menu>}/>

      <View style={globalStyles.viewActivityDetailContainer}>

        <Text style={globalStyles.viewActivityTitle}>{transaction?.description}</Text>
        <Text style={[globalStyles.viewActivityAmount, { color: themeColor }]}>₹{transaction?.amount}</Text>
        {transaction?.transaction_category && <Text style={styles.categoryPill}>{transaction.transaction_category}</Text>}

      </View>

      <View style = {styles.minDetails}>
        <View style = {styles.minDetailsDownView}><MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#0A6FE3" />   <Text style = {styles.minDetailsDownText}>{moment(transaction?.created_at_date_time).format("DD MMM YYYY, hh:mm A")}</Text></View>
          {transaction?.wallet_id && (
            <View style = {styles.minDetailsDownView}><MaterialCommunityIcons name="wallet-outline" size={24} color="#0A6FE3" />   <Text style = {styles.minDetailsDownText}>{transaction.transaction_type === "expense" ? "Paid via " : "Received in "}{walletData?.data?.wallet_title || "Unknown"}</Text></View>
          )}
      </View>

      {transaction?.notes && (
        <View style={styles.splitContainer}>
          <Text style={styles.splitHeader}>Notes</Text>
          <Text style={globalStyles.viewActivityNotesText}>{transaction.notes}</Text>
        </View>
      )}

      {imageUrl && (
        <>
          <TouchableOpacity onPress={() => setViewImage(true)}>
            <View style={styles.mediaContainer}>
              <Image source={{ uri: imageUrl}} style={styles.previewImage} />
            </View>
          </TouchableOpacity>
  
          <ImageViewing
          images={[{ uri: imageUrl}]}
          imageIndex={0}
          visible={viewImage}
          onRequestClose={() => setViewImage(false)}
          />
        </>
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
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 8,
    resizeMode: "contain",
  },
  minDetails: {
    width: 350,
    padding: 10,
    backgroundColor: "#F5FAFE",
    borderRadius: 7,
    alignSelf: "center",
    marginBottom: 10
  },
  minDetailsDownView: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center"
  },
  minDetailsDownText: {
    fontSize: 15,
    color: "#102547",
    textAlignVertical: "center"
  },
  splitContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 5,
  },
  splitHeader: {
    color: "#283E5B",
    fontSize: 18,
    fontWeight: "500"
  },
  categoryPill: {
    backgroundColor: '#EAF6FF',
    color: '#0077CC',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 12,
    alignSelf: 'center',
    marginVertical: 7
  }
});