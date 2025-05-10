import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu, Divider } from "react-native-paper";

import { Bill, useDeleteBillMutation, useGetBillQuery, useUpdateUserStatusOfBillMutation } from "@/store/billApi";
import TransactionCard from "@/components/readComponents/TransactionCard";
import { useLazyGetUserByIdQuery } from "@/store/userApi";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";

type MyStateInBill = {
  user_id: string;
  amount: number;
  wallet_id?: string;
  status: "pending" | "paid";
}

const BillDetailsScreen = () => {
  const { id } = useLocalSearchParams() as {id: string};
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [myBill, setMyBill] = useState<MyStateInBill | null>(null);
  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const [deleteBill, {isLoading: deleteLoading, error: deleteError}] = useDeleteBillMutation();
  const { data, isLoading, error, refetch } = useGetBillQuery(id);
  const [getUserById, { data: userData, isLoading: loading }] = useLazyGetUserByIdQuery();
  const [updateUserStatus, {isLoading: load}] = useUpdateUserStatusOfBillMutation();

  const bill = data?.data;
  const totalMembers = bill?.members?.length;
  const members = bill?.members;

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
    if (members) {
        setLocalLoading(true);
        (async () => {
            const newNames: Record<string, string> = {};
            await Promise.all(members.map(async (member) => {
                try {
                    const res = await getUserById(member.user_id).unwrap();
                    newNames[member.user_id] = res?.data?.name || "Unknown";
                } catch (error) {
                    newNames[member.user_id] = "Unknown";
                }
            }));
            setMemberNames(newNames);
            setLocalLoading(false);
        })();
    }
  }, [data, getUserById]);

  useEffect(() => {
      if (members && loggedInUserId) {
          const userBill = members.find((member) => member.user_id === loggedInUserId);
          setMyBill(userBill || null);
      }
  }, [members, loggedInUserId]);

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


  const handleStatusChange = (bill: MyStateInBill) => {
    if (bill.status === "paid") {
      markAsPending();
    } else {
      markAsPaid();
    }
  };
      
  const markAsPaid = async () => {
    try {
        // setLocalLoading(true);
        const res = await updateUserStatus({billId: id, body: {status: "paid"}}).unwrap();
    } catch (error) {
        console.log("Error updating bill status");
        const err = error as { data?: { message?: string } };
        if (err?.data?.message) {
          setErrorMessage(err.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
    } finally {
        // setLocalLoading(false);
    }
  };
      
  const markAsPending = async () => {
    try {
        // setLocalLoading(true);
        const res = await updateUserStatus({billId: id, body: {status: "pending"}}).unwrap();
    } catch (error) {
        console.log("Error updating bill status");
        const err = error as { data?: { message?: string } };
        if (err?.data?.message) {
          setErrorMessage(err.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
    } finally {
        // setLocalLoading(false);
    }
  };

  const handleBillDelete = async () => {
    try {
      const response = await deleteBill(id);
      console.log("bill deleting response",response);
      router.back();
    } catch (error) {
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

  if (!data?.data) return <Text>No bill found</Text>;

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
          <Menu.Item onPress={() => router.push({pathname:"/action/edit/editBill",params : {id:id}})} title="Edit" />
          <Divider />
          <Menu.Item onPress={() => Alert.alert(
              "Delete bill", 
              `Are you sure you want to delete ${bill?.bill_title}`, 
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => handleBillDelete()}
              ]
            )} title="Delete" />
        </Menu>}/>

      <View style={styles.detailContainer}>
        <Text style={styles.title}>{bill?.bill_title}</Text>
        <Text> Due on: {moment(bill?.due_date_time).format("DD MMM YYYY, hh:mm A")}</Text>
      </View>

      <View style={styles.members}>

        <Text style={styles.title}>Total bill amount: ₹{bill?.amount}</Text>

        {localLoading && (
            <View style = {styles.loaderContainer}>
                <ActivityIndicator color="#000"/>
            </View>
        )}

        {totalMembers && totalMembers > 1 && !localLoading && Object.keys(memberNames).length === totalMembers && (
            <FlatList
                data={members}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => (
                    <TransactionCard
                        title={memberNames[item.user_id]}
                        imageType={undefined}
                        amount={`₹${item.amount}`}
                        subtitle={undefined}
                        transactionType={undefined}
                        cardStyle={item.status === "pending" ? { backgroundColor: "#FFCDD2" } : { backgroundColor: "#e6f7e6" }}
                        amountStyle={{fontWeight: "3500"}}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 7, backgroundColor: 'white' }} />}
                contentContainerStyle={{ paddingBottom: 0 }}
            />
        )}
      </View>

      <View style={styles.paidButton}>
        {myBill && (
            <CustomButton onPress={() => handleStatusChange(myBill)} variant="outline" innerStyle={{borderColor: "#000", color: "#000"}} disabled={load}>
            {load ? (<ActivityIndicator color="#000"/>) : (myBill.status === "paid" ? "Mark as Pending" : "Mark as Paid")}
            </CustomButton>
        )}
      </View>

    </View>
  );
};

export default BillDetailsScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    width: "100%",
    height: 200,
    alignItems: 'center',
    justifyContent: "center"
  },
  paidButton: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  detailContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  members: {
    gap: 10,
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: "#111827",
    alignSelf: "center"
  },
  amount: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginVertical: 5,
  },
  menuButton: {
    padding: 10,
  },
});