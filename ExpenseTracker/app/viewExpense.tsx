import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import { useLazyGetUserByIdQuery } from "@/store/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyGetWalletQuery } from "@/store/walletApi";
import { useGetExpenseQuery } from "@/store/expenseApi";

// router.push({ pathname: "/viewTransaction", params: {id: "67cf2e67b3452d6bb43d2a23"} })

const ExpenseDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useGetExpenseQuery(id);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [getUserById, { data: creatorData }] = useLazyGetUserByIdQuery();
  const [borrowerNames, setBorrowerNames] = useState<Record<string, string>>({});
  const [lenderName, setLenderName] = useState("Unknown");
  const [userState, setUserState] = useState(null);
  const [getWallet, { data: walletData }] = useLazyGetWalletQuery();
  const [paidByName,setPaidByName] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const expense = data?.data;
  console.log(expense);

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

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading expense details</Text>;
  if (!data?.data || !loggedInUserId) return <Text>No expense found</Text>;

  const isLender = expense.lenders.some((lender) => lender.user_id === loggedInUserId);
  const isBorrower = expense.borrowers.some((borrower) => borrower.user_id === loggedInUserId);

  const themeColor = isLender ? "#10B981" : isBorrower ? "#EF4444" : "#374151";

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
          <Menu.Item onPress={() => router.push({ pathname: "/editExpense", params: {id:id,paidByName:paidByName} })} title="Edit" />
          <Divider />
          <Menu.Item onPress={() => console.log("Delete Expense")} title="Delete" />
        </Menu>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.title}>{expense.description}</Text>
        <Text style={[styles.amount, { color: themeColor }]}>₹{userState}</Text>
        {isLender && expense.wallet_id && (
          <Text style={styles.accountName}>Wallet: {walletData?.data?.wallet_title || "Unknown"}</Text>
        )}
        <Text style={styles.date}>{new Date(expense.created_at_date_time).toLocaleString()}</Text>
      </View>

      {expense.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>{expense.notes}</Text>
        </View>
      )}

      <View style={styles.splitContainer}>
        <Text style={styles.paidBy}>
          {lenderName} paid <Text style={styles.boldText}>₹{expense.total_amount}</Text>
        </Text>
        {expense.borrowers.map((borrower) => (
          <Text key={borrower.user_id} style={styles.oweText}>
            {borrowerNames[borrower.user_id] || "Unknown"} owes ₹{borrower.amount}
          </Text>
        ))}
      </View>

      {expense.media && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: expense.media.url }} style={styles.previewImage} />
      </View>
      )}
    </View>
  );
};

export default ExpenseDetailScreen;

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