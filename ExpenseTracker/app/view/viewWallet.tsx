import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";

import { useGetWalletQuery,useDeleteWalletMutation } from "@/store/walletApi";
import { globalStyles } from "@/styles/globalStyles";

const WalletDetailsScreen = () => {
  const { id } = useLocalSearchParams() as {id: string};

  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data, isLoading, error, refetch } = useGetWalletQuery(id);
  const [deleteWallet, {isLoading:isLoadingDelete}] = useDeleteWalletMutation();

  const wallet = data?.data;

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

  if (!data?.data) return <Text>No wallet found</Text>;

  const themeColor = (wallet && wallet.lower_limit) ? (wallet.lower_limit <= wallet.amount) ? "#10B981" : "#EF4444" : "#000";

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
          <Menu.Item onPress={() => {setMenuVisible(false);router.push({pathname:"/action/edit/editWallet",params:{fetchedId:id,fetchedAmount:wallet?.amount,fetchedName:wallet?.wallet_title,fetchedLowerLimit:wallet?.lower_limit}})}} title="Edit" />
          <Divider />
          <Menu.Item onPress={() => Alert.alert(
                        "Delete wallet", 
                        `Are you sure you want to delete ${wallet?.wallet_title}`, 
                        [
                          { text: "Cancel", style: "cancel" },
                          { text: "Yes", onPress: () => onDelete()}
                        ]
                      )} title="Delete" />
        </Menu>
      </View>

      <View style={globalStyles.viewActivityDetailContainer}>
        <Text style={globalStyles.viewActivityTitle}>{wallet.wallet_title}</Text>
        <Text style={[globalStyles.viewActivityAmount, { color: themeColor }]}>₹{wallet.amount}</Text>
        {wallet.lower_limit && (<Text style={globalStyles.viewActivityDate}>Lower limit : {wallet.lower_limit}</Text>)}
      </View>

    </View>
  );
};

export default WalletDetailsScreen;
