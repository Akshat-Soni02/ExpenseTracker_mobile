import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useGetBillQuery, useUpdateUserStatusOfBillMutation } from "@/store/billApi";
import moment from "moment";
import TransactionCard from "@/components/TransactionCard";
import { useLazyGetUserByIdQuery } from "@/store/userApi";
import CustomButton from "@/components/button/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BillDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [myBill, setMyBill] = useState(null);
  const { data, isLoading, error, refetch } = useGetBillQuery(id);
  const [getUserById, { data: userData, isLoading: loading }] = useLazyGetUserByIdQuery();
  const [updateUserStatus, {isLoading: load}] = useUpdateUserStatusOfBillMutation();
  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const [localLoading, setLocalLoading] = useState(false);
  const bill = data?.data;
  const totalMembers = bill?.members.length;
  const members = bill?.members;
  console.log(members);
  console.log(totalMembers);
//   {billId: id, body: }

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
                    newNames[member.user_id] = "Unknown"; // Handle API errors
                }
            }));
            setMemberNames(newNames);
            setLocalLoading(false); // Ensure loading state updates only after all data is fetched

        })();
        }
    }, [data, getUserById]);

    useEffect(() => {
        if (members && loggedInUserId) {
            const userBill = members.find((member) => member.user_id === loggedInUserId);
            setMyBill(userBill || null);
        }
    }, [members, loggedInUserId]);


    const handleStatusChange = (bill) => {
        if (bill.status === "paid") {
          markAsPending();
        } else {
          markAsPaid();
        }
      };
      
      const markAsPaid = async () => {
        console.log("Marking as paid...");
        try {
            // setLocalLoading(true);
            const res = await updateUserStatus({billId: id, body: {status: "paid"}}).unwrap();
            console.log("Bill status update response: ", res);
        } catch (error) {
            console.log("Error updating bill status");
        } finally {
            // setLocalLoading(false);
        }
      };
      
      const markAsPending = async () => {
        console.log("Marking as pending...");
        try {
            // setLocalLoading(true);
            const res = await updateUserStatus({billId: id, body: {status: "pending"}}).unwrap();
            console.log("Bill status update response: ", res);
        } catch (error) {
            console.log("Error updating bill status");
        } finally {
            // setLocalLoading(false);
        }
      };
      


  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading bill details</Text>;
  if (!data?.data) return <Text>No bill found</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={22} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.title}>{bill.bill_title}</Text>
        <Text style={styles.date}>Due on: {moment(bill.due_date_time).format("DD MMM, YYYY, hh:mm A")}</Text>
        {/* <Text style={[styles.amount, { color: themeColor }]}>₹{bill.amount}</Text> */}
        {/* {bill.bill_category && (<Text style={styles.date}>Category: {bill.bill_category}</Text>)} */}
      </View>

      <View style={styles.members}>
        <Text style={styles.title}>Total bill amount: ₹{bill.amount}</Text>
        {localLoading && (
            <View style = {styles.loaderContainer}>
                <ActivityIndicator color="#000"/>
            </View>
        )}
        {totalMembers > 1 && !localLoading && Object.keys(memberNames).length === totalMembers && (
            <FlatList
                data={members}
                keyExtractor={(item) => item._id}
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
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  mandatory: {
    alignItems: "flex-start",
    gap: 5,
  },
  optional: {
    alignItems: "flex-end",
    gap: 5,
  },
  detailContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  members: {
    // alignItems: "center",
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
});