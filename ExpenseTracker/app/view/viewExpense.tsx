import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, ScrollView } from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ImageViewing from 'react-native-image-viewing';

import { useLazyGetUserByIdQuery } from "@/store/userApi";
import { useLazyGetWalletQuery } from "@/store/walletApi";
import { useGetExpenseQuery, useDeleteExpenseMutation } from "@/store/expenseApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const ExpenseDetailScreen = () => {

  const { id } = useLocalSearchParams() as {id: string};
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [borrowerNames, setBorrowerNames] = useState<Record<string, string>>({});
  const [lenderName, setLenderName] = useState<string>("Unknown");
  const [userState, setUserState] = useState<number | null>(null);
  const [paidByName,setPaidByName] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [viewImage, setViewImage] = useState(false);

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
    <ScrollView style={globalStyles.viewContainer}>
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
        
        <Text style={styles.exchangeTitle}>{isLender ? "You are owed" : "You owe"}</Text>
        <Text style={styles.exchangeTitle}>₹{userState?.toFixed(2) || 0}</Text>
        {expense?.expense_category && <Text style={styles.categoryPill}>{expense.expense_category}</Text>}
        <Text style={styles.expenseTitle} numberOfLines={2} ellipsizeMode="tail">{expense?.description}</Text>
      </View>

      <View style = {styles.minDetails}>
        <View style = {styles.minDetailsUp}>
          <MaterialIcons name="list-alt" size={40} color="#0A6FE3" />
          <View style = {styles.minDetailsBillPrimary}>
            <Text style = {styles.minDetailsBillPrimaryText}>Paid by {lenderName}</Text>
            {isLender && expense?.wallet_id && (
              <Text style = {styles.minDetailsBillPrimaryText}>₹{expense?.total_amount}</Text>
            )}
          </View>
        </View>
        <View style = {styles.minDetailsDown}>
            <View style = {styles.minDetailsDownView}><MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#0A6FE3" />   <Text style = {styles.minDetailsDownText}>{moment(expense?.created_at_date_time).format("DD MMM YYYY, hh:mm A")}</Text></View>
            {isLender && expense?.wallet_id && (
              <View style = {styles.minDetailsDownView}><MaterialCommunityIcons name="wallet-outline" size={24} color="#0A6FE3" />   <Text style = {styles.minDetailsDownText}>Paid via {walletData?.data?.wallet_title || "Unknown"}</Text></View>
            )}
        </View>
      </View>

      <View style={[styles.splitContainer, {borderColor: "#eeeeee",borderBottomWidth: 1}]}>
        <Text style={styles.splitHeader}>
          People Who Owe {lenderName}
        </Text>
        {expense?.borrowers?.filter(
          (b) => borrowerNames[b.user_id] !== 'You'
        ).length === 0 ? (
          <Text>
            No one else owes {lenderName}
          </Text>
        ) : (
          expense?.borrowers
            .filter((b) => borrowerNames[b.user_id] !== 'You')
            .map((borrower) => (
              <View style = {styles.splitRow}>
                  <Text key={borrower.user_id+"a"} style={styles.splitRowText}>
                    {borrowerNames[borrower.user_id] || 'Unknown'}
                  </Text>
                  <Text key={borrower.user_id+"b"} style={styles.splitRowText}>
                    ₹{borrower.amount}
                  </Text>
              </View>
            ))
        )}
      </View>

      {expense?.notes && (
        <View style={styles.splitContainer}>
          <Text style={styles.splitHeader}>Notes</Text>
          <Text style={globalStyles.viewActivityNotesText}>{expense.notes}</Text>
        </View>
      )}

      {expense?.media && (
        <>
        <TouchableOpacity onPress={() => setViewImage(true)}>
          <View style={styles.mediaContainer}>
            <Image source={{ uri: expense?.media.url }} style={styles.previewImage} />
          </View>
        </TouchableOpacity>

        <ImageViewing
        images={[{ uri: expense?.media.url}]}
        imageIndex={0}
        visible={viewImage}
        onRequestClose={() => setViewImage(false)}
        />
      </>
      )}
    </ScrollView>
  );
};

export default ExpenseDetailScreen;

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
  },
  expenseTitle: {
    color: "#111827",
    fontSize: 15
  },
  exchangeTitle: {
    color: "#2a435f",
    fontSize: 30,
    fontWeight: "500"
  },
  exchangeState: {
    color: "#456479",
    fontSize: 18
  },
  minDetails: {
    width: 350,
    padding: 10,
    backgroundColor: "#F5FAFE",
    borderRadius: 7,
    alignSelf: "center",
    marginBottom: 10
  },
  minDetailsUp: {
    flexDirection: "row",
    borderColor: "#eeeeee",
    borderBottomWidth: 1,
    gap: 15,
    padding: 10
  },
  minDetailsBillPrimary: {
    gap: 5
  },
  minDetailsBillPrimaryText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#324865"
  },
  minDetailsDown: {
    gap: 5,
    padding: 10
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
  splitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3
  },
  splitRowText: {
    color: "#112949",
    fontSize: 17
  },
  categoryPill: {
    backgroundColor: '#F0F4FF',
    color: '#1e3a8a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    alignSelf: 'center',
    marginVertical: 7
  }
});