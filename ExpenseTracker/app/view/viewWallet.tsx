import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SectionList, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

import { useGetWalletQuery,useDeleteWalletMutation, useGetWalletTransactionsQuery } from "@/store/walletApi";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import moment from "moment";

const WalletDetailsScreen = () => {
  const { id } = useLocalSearchParams() as {id: string};

  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currMonthSpent, setCurrMonthSpent] = useState<number>(0);
  const [currMonthIncome, setCurrMonthIncome] = useState<number>(0);
  const [allTransactions, setAllTransactions] = useState([]);

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
        console.log("getting data");
        const expenses = transactions?.expenses;
        const personal = transactions?.personals;
        setAllTransactions(prev => [...prev, ...expenses]);
        setAllTransactions(prev => [...prev, ...personal]);

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

  const TransactionsScreen = ({ allTransactions }) => {

    const groupedByMonth = useMemo(() => {
      const grouped = allTransactions?.reduce((acc, item) => {
      const date = item.created_at_date_time;
      if (!date) return acc;

      const monthKey = moment(date).format("MMMM YYYY");

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }

      acc[monthKey].push(item);
      return acc;
    },{});

    // Sort each month group by date (latest first)
    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) =>
        new Date(b.created_at_date_time).getTime() -
        new Date(a.created_at_date_time).getTime()
      );
    });

    // Convert to SectionList format
    return Object.keys(grouped).map(month => ({
      title: month,
      data: grouped[month]
    }));
  }, [allTransactions]);

  return (
    <SectionList
      sections={groupedByMonth}
      keyExtractor={(item) => item._id}
      style = {{marginVertical: 5, paddingBottom: 10}}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            if(item.lenders) {
              router.push({
                pathname: "/view/viewExpense",
                params: { id: item._id },
              })
            }
            else {
              router.push({
                pathname: "/view/viewTransaction",
                params: { id: item._id },
              })
            }
          }
          }
          style={styles.expenseRow}
        >
          <View style={styles.expenseTextContainer}>
            <View style={{flexDirection: "row", gap: 2}}>
              {item.lenders ? (<MaterialIcons name="call-split" size={20} color="#111827" />):(<AntDesign name="arrowsalt" size={18} color="#111827" />)}
              <Text style={styles.expenseDescription} numberOfLines={1}> {item?.description || "No description"} </Text>
            </View>
          </View>
          <View style={styles.expenseAmountContainer}>
            <Text style={styles.expenseDate}>
              {item?.created_at_date_time
                ? moment(item.created_at_date_time).format("DD MMM, hh:mm A")
                : "Unknown Date"}
            </Text>
            <Text
              style={[
                styles.expenseAmount,
                { color: "black", fontWeight: "400" },
              ]}
            >
              ₹{Math.abs(item?.total_amount?.toFixed(2) || item?.amount?.toFixed(2))}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionTitle}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{title}</Text>
        </View>
      )}
    />
  );
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

        <View style={styles.walletContainer}>
          <Text style={styles.walletTitle}>{wallet?.wallet_title}</Text>

          <Text style={styles.walletAmount}>₹{wallet?.amount}</Text>

          {wallet?.lower_limit && (
            <Text style={styles.walletLowerLim}>Lower limit: ₹{wallet.lower_limit}</Text>
          )}

          <Text style={styles.walletMonthlyHeader}>This month</Text>

          <View style={styles.walletStatsRow}>
            <Text style={styles.walletSpent}>Spent: ₹{currMonthSpent}</Text>
            <Text style={styles.walletIncome}>Income: ₹{currMonthIncome}</Text>
          </View>
        </View>



      <TransactionsScreen allTransactions={allTransactions}/>

    </ScrollView>
  );
};

export default WalletDetailsScreen;

const styles = StyleSheet.create({
  walletContainer: {
    width: "90%",
    alignSelf: "center",
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  
  walletTitle: {
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
    marginBottom: 6,
  },
  
  walletAmount: {
    fontSize: 26,
    fontWeight: "500",
    color: "#212121",
    textAlign: "center",
    marginBottom: 4,
  },
  
  walletLowerLim: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginBottom: 14,
  },
  
  walletMonthlyHeader: {
    fontSize: 15,
    fontWeight: "500",
    color: "#212121",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  
  walletStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 4,
  },
  
  walletSpent: {
    fontSize: 15,
    color: "#D32F2F",
  },
  
  walletIncome: {
    fontSize: 15,
    color: "#388E3C",
  },
  
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  expenseTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  
  expenseDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827", 
    marginBottom: 2,
    textAlignVertical: "center",
    verticalAlign: "middle"
  },
  
  expenseAmountContainer: {
    alignItems: "flex-end",
  },
  
  expenseDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  
  expenseAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 2,
  },
});
