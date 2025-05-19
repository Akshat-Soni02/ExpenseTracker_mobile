import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";

import { useGetWalletQuery,useDeleteWalletMutation, useGetWalletTransactionsQuery } from "@/store/walletApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";

const WalletDetailsScreen = () => {
  const { id } = useLocalSearchParams() as {id: string};

  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currMonthSpent, setCurrMonthSpent] = useState<number>(0);
  const [currMonthIncome, setCurrMonthIncome] = useState<number>(0);

  const { data, isLoading, error, refetch } = useGetWalletQuery(id);
  const { data: transactionData, isLoading: isLoadingWalletTran, error: tranErr} = useGetWalletTransactionsQuery(id);
  const [deleteWallet, {isLoading:isLoadingDelete}] = useDeleteWalletMutation();

  const wallet = data?.data;
  const transactions = transactionData?.data;

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

  useEffect(() => {
    const getCurrentMonthData = () => {
      if(transactions) {
        const expenses = transactions?.expenses;
        const personal = transactions?.personals;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        expenses
          .filter((exp) => {
            const expDate = new Date(exp.created_at_date_time);
            return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
          })
          .forEach((expense) => {
            setCurrMonthSpent((prev) => prev + expense.total_amount);
          });

        personal.filter((per) => {
          const perDate = new Date(per.created_at_date_time);
          return perDate.getMonth() === currentMonth && perDate.getFullYear() === currentYear;
        }).forEach((per) => {
          if(per.transaction_type === "expense") setCurrMonthSpent((prev) => prev + per.amount);
          else  setCurrMonthIncome((prev) => prev + per.amount);
        });
      }
    }
    getCurrentMonthData();
  }, [transactions]);

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

  const themeColor = (wallet && wallet.lower_limit) ? (wallet.lower_limit <= wallet.amount) ? "#1e9738" : "#d86161" : "#000";

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
      <Header headerIcon={<Menu
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
        </Menu>}/>

      <Text style={styles.walletTitle}>{wallet?.wallet_title}</Text>
      <View style={styles.walletHeader}>
        <Text style={[styles.walletAmount, { color: themeColor }]}>₹{wallet?.amount}</Text>
        {wallet?.lower_limit && (<Text style={styles.walletLowerLim}>Lower limit : ₹{wallet.lower_limit}</Text>)}
      </View>

      <View style = {styles.walletMonthlyContainer}>
        <Text style = {styles.walletMonthlyHeader}>This month: </Text>
        <Text style = {styles.walletMonthlyAmount}>₹{currMonthSpent} spent, </Text>
        <Text style = {styles.walletMonthlyAmount}>₹{currMonthIncome} income</Text>
      </View>

    </View>
  );
};

export default WalletDetailsScreen;

const styles = StyleSheet.create({
  walletTitle: {
    textAlign: "center",
    fontSize: 25,
    color: "#212121",
    marginBottom: 10
  },
  walletHeader: {
    width: 300,
    padding: 12,
    backgroundColor: "#F5FAFE",
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 5
  },
  walletAmount: {
    fontSize: 30,
    fontWeight: "500"
  },
  walletLowerLim: {
    fontSize: 18,
    color: "#727272"
  },
  walletMonthlyContainer: {
    backgroundColor: "#F5FAFE",
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center"
  },
  walletMonthlyHeader: {
    fontSize: 18,
    fontWeight: "500",
  },
  walletMonthlyAmount: {
    fontSize: 19,
    fontWeight: "500"
  }
})
