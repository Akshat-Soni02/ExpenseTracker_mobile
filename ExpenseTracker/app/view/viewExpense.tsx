import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

import { useLazyGetUserByIdQuery } from "@/store/userApi";
import { useLazyGetWalletQuery } from "@/store/walletApi";
import { useGetExpenseQuery, useDeleteExpenseMutation } from "@/store/expenseApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";


const ExpenseDetailScreen = () => {

  const { id } = useLocalSearchParams() as {id: string};
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [borrowerNames, setBorrowerNames] = useState<Record<string, string>>({});
  const [lenderName, setLenderName] = useState<string>("Unknown");
  const [userState, setUserState] = useState<number | null>(null);
  const [paidByName,setPaidByName] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data, isLoading, error, refetch } = useGetExpenseQuery(id);
  const [deleteExpense, {isLoading: deleteLoading, error: deleteError}] = useDeleteExpenseMutation();
  const [getUserById, { data: creatorData }] = useLazyGetUserByIdQuery();
  const [getWallet, { data: walletData }] = useLazyGetWalletQuery();

  const expense = data?.data;

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setLoggedInUserId(user._id);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (data?.data?.borrowers && loggedInUserId) {
      (async () => {
        const newNames: Record<string, string> = {};
        for (const borrower of data.data.borrowers) {
          const res = await getUserById(borrower.user_id).unwrap();
          newNames[borrower.user_id] = res?.data?.name || "Unknown";
          if (borrower.user_id === loggedInUserId) {
            setUserState(borrower.amount);
            newNames[borrower.user_id] = "You";
          }
        }
        setBorrowerNames(newNames);
      })();
    }
  }, [data, getUserById, loggedInUserId]);

  useEffect(() => {
    if (data?.data?.lenders && loggedInUserId) {
      (async () => {
        const res = await getUserById(data?.data?.lenders[0].user_id).unwrap();
        setLenderName(res.data.name);
        setPaidByName(res.data.name);
        if (data?.data?.lenders[0].user_id === loggedInUserId) {
          setUserState(data?.data?.lenders[0].amount);
          setLenderName("You");
        }
      })();
    }
  }, [data, getUserById, loggedInUserId]);

  useEffect(() => {
    if (expense?.wallet_id) {
      getWallet(expense.wallet_id);
    }
  }, [expense?.wallet_id]);

  useFocusEffect(
    useCallback(() => {
      setMenuVisible(false);
    }, [])
  );

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
    }
  }, [errorMessage]);

  const handleExpenseDelete = async () => {
    try {
      await deleteExpense(id);
      router.back();
    } catch (error) {
      console.log("error deleting split",error);
      const err = error as { data?: { message?: string } };
      if (err?.data?.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  }

  if (isLoading || deleteLoading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;
  
  if (error) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in error) {
      errorMessage = `Server Error: ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      errorMessage = `Client Error: ${error.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }

  if (!data?.data || !loggedInUserId) return <Text>No expense found</Text>;

  const isLender = expense?.lenders.some((lender) => lender.user_id === loggedInUserId);
  const isBorrower = expense?.borrowers.some((borrower) => borrower.user_id === loggedInUserId);
  const themeColor = isLender ? "#1e9738" : isBorrower ? "#d86161" : "#374151";

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
          <Menu.Item onPress={() => router.push({ pathname: "/action/edit/editExpense", params: {id:id,paidByName:paidByName} })} title="Edit" />
          <Divider />
          <Menu.Item onPress={() => Alert.alert(
                      "Delete split", 
                      `Are you sure you want to delete ${expense?.description}`, 
                      [
                        { text: "Cancel", style: "cancel" },
                        { text: "Yes", onPress: () => handleExpenseDelete()}
                      ]
                    )} title="Delete" />
        </Menu>}/>

      <View style={globalStyles.viewActivityDetailContainer}>
        
        <Text style={globalStyles.viewActivityTitle}>{expense?.description}</Text>
        <Text style={[globalStyles.viewActivityAmount, { color: themeColor }]}>₹{userState?.toFixed(2) || 0}</Text>
        {isLender && expense?.wallet_id && (
          <Text style={globalStyles.viewActivityAccountName}>Wallet: {walletData?.data?.wallet_title || "Unknown"}</Text>
        )}
        <Text style={globalStyles.viewActivityDate}>{moment(expense?.created_at_date_time).format("DD MMM YYYY, hh:mm A")}</Text>
      </View>

      {expense?.notes && (
        <View style={globalStyles.viewActivityNotesContainer}>
          <Text style={globalStyles.viewActivityNotesTitle}>Notes</Text>
          <Text style={globalStyles.viewActivityNotesText}>{expense.notes}</Text>
        </View>
      )}

      <View style={globalStyles.viewActivitySplitContainer}>
        <Text style={globalStyles.viewActivityPaidBy}>
          {lenderName} paid <Text style={globalStyles.viewActivityBoldText}>₹{expense?.total_amount}</Text>
        </Text>
        {expense?.borrowers.map((borrower) => (
          <Text key={borrower.user_id} style={globalStyles.viewActivityOweText}>
            {borrowerNames[borrower.user_id] === "You"
              ? `You owe ₹${borrower.amount}`
              : `${borrowerNames[borrower.user_id] || "Unknown"} owes ₹${borrower.amount}`}
          </Text>
        ))}
      </View>

      {expense?.media && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: expense?.media.url }} style={styles.previewImage} />
      </View>
      )}
    </View>
  );
};

export default ExpenseDetailScreen;

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
  },
});