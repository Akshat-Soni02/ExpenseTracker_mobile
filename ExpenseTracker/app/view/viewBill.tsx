import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Menu, Divider } from "react-native-paper";

import { useDeleteBillMutation, useGetBillQuery, useUpdateUserStatusOfBillMutation } from "@/store/billApi";
import { useLazyGetUserByIdQuery } from "@/store/userApi";
import CustomButton from "@/components/button/CustomButton";
import { globalStyles } from "@/styles/globalStyles";
import Header from "@/components/Header";
import CustomSnackBar from "@/components/CustomSnackBar";

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
  const [visible, setVisible] = useState<boolean>(false);
  
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
    const loadNames = () => {
      if (members) {
        setLocalLoading(true);
        (async () => {
            const newNames: Record<string, string> = {};
            await Promise.all(members.map(async (member) => {
                try {
                    const res = await getUserById(member.user_id).unwrap();
                    newNames[member.user_id] = res?.data?.name || "Unknown";
                    if(member.user_id === loggedInUserId) newNames[member.user_id] = "You";
                } catch (error) {
                    newNames[member.user_id] = "Unknown";
                }
            }));
            setMemberNames(newNames);
            setLocalLoading(false);
        })();
      }
    }
    loadNames();
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
        setVisible(true);
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
        setVisible(true);
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

  const StatusChip = ({status}: {status: "paid" | "pending"}) => {
    return (
      <View style = {[styles.chipContainer, status === "paid" ? styles.paidChip : styles.pendingChip]}>
        <Text style = {[styles.chipText, status === "paid" ? styles.paidText : styles.pendingChipText]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    );
  };

  const ItemRow = ({ name, amount, status }: {name: string, amount: string, status: any}) => {
    return (
      <View style={styles.row}>
        <Text style={styles.name}>{name}</Text>
  
        <Text style={styles.indvAmount}>₹ {amount}</Text>
  
        <Text style={styles.status}>{status}</Text>
      </View>
    );
  };
  

  const DueDateBlock = ({ dueDate }:{dueDate: string}) => {
    const dueMoment = moment(dueDate);
    const remainingDays = dueMoment.diff(moment(), 'days');
    const remainingText =
      remainingDays > 0
        ? `${remainingDays} day${remainingDays > 1 ? 's' : ''} left`
        : remainingDays === 0
        ? 'Due Today'
        : 'Overdue';
  
    const month = dueMoment.format('MMM');
    const day = dueMoment.format('DD');
    const time = dueMoment.format('hh:mm A');
  
    return (
      <View style={styles.dateTimeContainer}>

        {/* Left column: Enhanced Date Display */}
        <View style={styles.dateBox}>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.day}>{day}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
  
        {/* Right column: Remaining Time */}
        <View style={styles.columnRight}>
          {bill?.status === "paid" ? (<Text style={styles.label}>Bill paid</Text>)
          : (
            <>
                <Text style={styles.label}>Time Left</Text>
                <View
                  style={[
                    styles.remainingBox,
                    remainingDays < 0
                      ? styles.overdue
                      : remainingDays === 0
                      ? styles.today
                      : styles.upcoming,
                  ]}
                >
                  <Text
                    style={[
                      styles.remainingText,
                      remainingDays <= 0 && { color: '#fff' },
                    ]}
                  >
                    {remainingText}
                  </Text>
                </View>
            </>
          )}
        </View>
      </View>
    );
  };

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
          contentStyle={{ backgroundColor: "#fff" }}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={globalStyles.menuButton}>
              <Entypo name="dots-three-vertical" size={20} color="black" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => router.push({pathname:"/action/edit/editBill",params : {id:id}})} title="Edit" style={{ backgroundColor: "#fff" }}/>
          <Divider />
          <Menu.Item onPress={() => Alert.alert(
              "Delete bill", 
              `Are you sure you want to delete ${bill?.bill_title}`, 
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => handleBillDelete()}
              ]
            )} title="Delete" style={{ backgroundColor: "#fff" }}/>
        </Menu>}/>

      <View style={styles.detailContainer}>
        <Text style={styles.title}>{bill?.bill_title}</Text>
        <DueDateBlock dueDate={bill?.due_date_time.toString() || new Date().toString()}/>
      </View>

      <View style={styles.members}>

        <Text style={[styles.title,{fontSize: 25}]}>Total bill: ₹{bill?.amount}</Text>

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
                    <ItemRow name={memberNames[item.user_id]} amount={item.amount.toString()} status={<StatusChip status={item.status}/>}/>
                )}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#d2d2d2' }} />}
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

      <CustomSnackBar
          message="Status updated successfully"
          visible={visible}
          onDismiss={() => setVisible(false)}
      />
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
    marginBottom: 25,
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
  dateTimeContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDF2FB',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBox: {
    alignItems: 'center',
    flex: 1,
    width: "50%",
    borderRightWidth: 1,
    borderColor: "#d2d2d2"
  },
  month: {
    fontSize: 14,
    color: '#6B7280', // soft gray
    fontWeight: '600',
    marginBottom: 2,
  },
  day: {
    fontSize: 32,
    color: '#1F2937',
    fontWeight: 'bold',
    lineHeight: 38,
  },
  time: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 4,
  },
  columnRight: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: "50%"
  },
  label: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
  },
  remainingBox: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  upcoming: {
    backgroundColor: '#D0F0FD',
  },
  today: {
    backgroundColor: '#FFCA72',
  },
  overdue: {
    backgroundColor: '#EF4444',
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C4A6E',    
  },
  chipContainer: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paidChip: {
    backgroundColor: "#E6F4EA"
  },
  paidText: {
    color: "#1E8E3E"
  },
  pendingChip: {
    backgroundColor: "#FDECEA"
  },
  pendingChipText: {
      color: "#D93025"
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  indvAmount: {
    width: 80,
    fontSize: 16,
    textAlign: 'right',
    marginRight: 17,
    color: '#111827',
  },
  status: {
    width: 80,
  },
});