import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, TextInput } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import { FAB, Portal, PaperProvider, Menu, Divider } from 'react-native-paper';

import { useGetGroupQuery, useGetGroupHistoryQuery, useAddPeopleInGroupMutation } from "@/store/groupApi";
import { useRemindAllGroupBorrowersMutation ,useLazyLeaveGroupQuery,  useSimplifyDebtsMutation} from "@/store/groupApi";
import { useGetUserFriendsQuery, useLazyGetUserFriendsQuery } from "@/store/userApi";
import { globalStyles } from "@/styles/globalStyles";
import { FlashList } from "@shopify/flash-list";
import CustomButton from "@/components/button/CustomButton";

const GroupDetailsScreen = () => {

  const { id } = useLocalSearchParams() as {id: string};

  const [menuVisible, setMenuVisible] = useState(false);
  const [state, setState] = React.useState({ open: false });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { data, isLoading, error, refetch } = useGetGroupQuery(id);
  const { data: history, isLoading: loading, error: historyError } = useGetGroupHistoryQuery(id);
  const [leaveGroup, { isFetching, error:leaveError }] = useLazyLeaveGroupQuery();
  const [getFriends, { isFetching: friendsFetching, error:FriendError }] = useLazyGetUserFriendsQuery();
  const [remindAll, {isLoading: loadingBorrowReq}] = useRemindAllGroupBorrowersMutation();
  const [addPeople, {isLoading: loadingAddPeople}] = useAddPeopleInGroupMutation();
  const [simplifyDebts, {isLoading: loadingSimplify}] = useSimplifyDebtsMutation();
  const { data: friends, isLoading: loadingFriends, error: errorFriend } = useGetUserFriendsQuery();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fromMembers, setFromMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [updateUI, setUpdateUI] = useState<boolean>(false);


  const group = data?.data;
  const totalMembers = group?.members.length;

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
    if (friends) {
      if (friends.data.length > 0) {
        let toAdd = [];
        friends.data.forEach((friend) => {
          if(group?.members.find((member) => member.member_id === friend._id)) return;
          else toAdd.push(friend);
        })
        setFromMembers(toAdd);
      }
    }
  }, [group, friends]);

  const filteredUsers = React.useMemo(() => {
    return fromMembers?.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  }, [fromMembers, searchQuery]);


  const { open } : { open : boolean} = state;
  const onStateChange = ({ open } : { open : boolean}) => setState({ open });

  const toggleUserSelection = (user) => {
    let newSelectedUsers;
    if (selectedUsers.some((u) => u._id === user._id)) {
      newSelectedUsers = selectedUsers.filter((u) => u._id !== user._id);
    } else {
      newSelectedUsers = [...selectedUsers, { ...user }];
    }
    setSelectedUsers(newSelectedUsers);
    setUpdateUI((prev) => !prev);
  };

  const handleRemindAll = async () => {
    try {
      const response = await remindAll({group_id: id}).unwrap();
      Alert.alert(
        "Remainder Sent", 
        "A remainder has been sent", 
        [
          { text: "ok", style: "cancel" },
        ]
      )
    } catch (error) {
      console.error("Error sending borrowers mail:", error);
      const err = error as { data?: { message?: string } };
      Alert.alert(
        "Remainder Error", 
        `${err?.data?.message}`, 
        [
          { text: "ok", style: "cancel" },
        ]
      )
    }
  };

  const handleLeaveGroup = async () => {
     try {
       await leaveGroup({ groupId:id }).unwrap();
       console.log("Successfully left the group");
       router.push("/(tabs)");
     } catch (error) {
       console.error("Error leaving group:", error);
       const err = error as { data?: { message?: string } };
       Alert.alert(
         "Cannot leave group", 
         `${err?.data?.message}`, 
         [
           { text: "ok", style: "cancel" },
         ]
       )
     }
   };

  const handleAddPeople = async () => {
    // setModalVisible(true);
    // Alert.alert(
    //   "Add people", 
    //   "Feature on hold!", 
    //   [
    //     { text: "Ok", style: "cancel" },
    //     // { text: "Yes", onPress: () => handleRemindAll()}
    //   ]
    // )
    if(selectedUsers.length === 0) {
      setModalVisible(false);
      return;
    }
    try {
      const newMemberIds = selectedUsers.map((user) => user._id);
      await addPeople({ id, body: {newMemberIds} }).unwrap();
      console.log("Successfully added to the group");
      setModalVisible(false);
      setSelectedUsers([]);
    } catch (err) {
      console.error("Error adding to group:", err);
    }
  };

  const printSelected = () => {
    console.log(selectedUsers);
    setModalVisible(false);
  }


  const onSimplifyDebts = async () => {
  try {
    await simplifyDebts(id).unwrap();
    console.log("Successfully simplified debts");
    refetch();
  } catch (error) {
    console.error("Error simplifying debts:", error);
    const err = error as { data?: { message?: string } };
    if (err?.data?.message) {
      setErrorMessage(err.data.message);
    } else {
      setErrorMessage("Something went wrong. Please try again.");
    }
  }
};

  if (isLoading || loading) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  if (error) {
    let errorMessage = "An unknown error occurred";
  
    if ("status" in error) {
      errorMessage = `Server Error: ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      errorMessage = `Client Error: ${error.message}`;
    }
    return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  }
  
  if (!data?.data) return <Text>No group found</Text>;
  return (
    <PaperProvider>

    <View style={{flex:1}}>
    <View style={globalStyles.viewContainer}>
      {/* Header */}
      <View style={globalStyles.viewHeader}>
        <TouchableOpacity onPress={() => router.back()} style={globalStyles.backButton}>
          <FontAwesome name="arrow-left" size={22} color="black" />
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
          <Menu.Item onPress={() => router.push({pathname:"/action/edit/editGroup",params:{id:id}})} title="Edit" />
          <Divider />
          <Menu.Item onPress={() => Alert.alert(
            "Leave Group", 
            "Are you sure you want to leave group?", 
            [
              { text: "Cancel", style: "cancel" },
              { text: "Yes", onPress: () => handleLeaveGroup()}
            ]
          )} title="Leave Group" />
        </Menu>
        
      </View>

      {/* Group Info */}
      <View style={styles.groupInfo}>

        <View style={styles.mandatory}>
          <Text style={styles.groupName}>{group?.group_title}</Text>
          <Text style={styles.groupDetails}>{totalMembers} Members</Text>
        </View>

        <View style={styles.optional}>

          {group?.initial_budget && (
            <Text style={styles.optionalField}>Budget: ₹{group.initial_budget}</Text>
          )}

          {group?.settle_up_date && (
            <Text style={styles.optionalField}>Settle-Up: {moment(group.settle_up_date).format("DD MMM, YYYY")}</Text>
          )}

        </View>

      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.remindButton} 
          onPress={() => 
            Alert.alert(
              "Remind All", 
              "This will send a remainder email to all your borrowers in the group!", 
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => handleRemindAll()}
              ]
            )
          }
        >
          <Text style={styles.buttonText}>Remind All</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settleButton} 
          onPress={() => router.push({ pathname: "/misc/groupSettlements", params: { group_id: group?._id,group_name:group?.group_title } })}
        >
          <Text style={styles.buttonText}>Settle Up</Text>
        </TouchableOpacity>

      </View>


      {/* Expense List */}
      {loading ? (
        <ActivityIndicator color="#000" />
      ) : history?.data && history.data.length > 0 ? (

        <FlatList
          data={history.data}
          keyExtractor={(item, index) => item._id ?? index.toString()}
          renderItem={({ item }) => {

            if (item.type === "expense") {
              return (

                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/view/viewExpense", params: { id: item._id } })}
                  style={styles.expenseRow}
                >

                  <View style={styles.expenseTextContainer}>

                    <Text style={styles.expenseDescription} numberOfLines={1}>
                      {item?.description || "No description"}
                    </Text>

                    {item?.expense_category && (<Text style={styles.expenseCategory}>{item.expense_category}</Text>)}

                  </View>
                  <View style={styles.expenseAmountContainer}>

                    <Text style={styles.expenseDate}>
                      {item?.created_at_date_time
                        ? moment(item.created_at_date_time).format("DD MMM, hh:mm A")
                        : "Unknown Date"}
                    </Text>

                    <Text style={[styles.expenseAmount, { color: "black", fontWeight: "400" }]}>
                      ₹{Math.abs(item?.total_amount?.toFixed(2) || 0)}
                    </Text>

                  </View>
                </TouchableOpacity>
              );

            } else if (item.type === "settlement") {

              return (
                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/view/viewSettlement", params: { id: item._id } })}
                  style={styles.settlementRow}
                >
                  <Text style={styles.settlementText} numberOfLines={1}>
                    {item?.settlement_description || "Settlement"}
                  </Text>

                  <View style={styles.expenseAmountContainer}>
                    <Text style={styles.expenseDate}>
                      {item?.createdAt
                        ? moment(item.createdAt).format("DD MMM, hh:mm A")
                        : "Unknown Date"}
                    </Text>

                    <Text style={styles.settlementAmount}>
                      ₹{Math.abs(item?.amount?.toFixed(2) || 0)}
                    </Text>
                  </View>

                </TouchableOpacity>
              );

            }

            return null;
          }}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noExpensesText}>No expenses found</Text>
      )}
      
    </View>
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? 'close' : 'plus'}
          actions={[
            // { icon: 'plus', onPress: () => console.log('Pressed add') },
            {
              icon: 'currency-inr',
              label: 'Add Split',
              onPress: () => router.push({ pathname: "/action/create/createExpense", params: { group_id: group?._id, group_name: group?.group_title } }),
            },
            {
              icon: 'account-plus',
              label: 'Add People',
              onPress:() => setModalVisible(true),
            },
            {
              icon: 'graphql',
              label: 'Simplify Debts',
              onPress: () =>  Alert.alert(
                "Simplify Group", 
                "Are you sure you want to simplify debts in this group?", 
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Yes", onPress: () => onSimplifyDebts()}
                ]
              ),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </View>

    <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <FlashList
            // style = {styles.flashList}
            data={filteredUsers}
            keyExtractor={(item) => item._id}
            estimatedItemSize={50}
            extraData={updateUI}
            renderItem={({ item }) => {
              const isSelected = selectedUsers.some((u) => u._id === item._id);
              return (
                <TouchableOpacity onPress={() => toggleUserSelection(item)} style={[styles.modalItem, isSelected && styles.selectedItem]}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={{  height: 2, backgroundColor: 'white'}} />
            )}
          />
          <CustomButton onPress={() => handleAddPeople()} style={{alignSelf: "center"}}>Done</CustomButton>
        </View>
      </Modal>
  </PaperProvider>

  );
};

export default GroupDetailsScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 20,},
  searchInput: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 10 },
  modalItem: { paddingVertical: 15, flexDirection: "row", width: "100%", paddingHorizontal: 10 },
  selectedItem: { backgroundColor: "rgba(111, 187, 250, 0.24)" },
  modalItemText: { fontSize: 16 },
    paidByContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    alignSelf: "center",
  },
  menuButton: {
    padding: 10,
  },
  settlementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginVertical: 5,
  },
  settlementText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#334155",
  },
  settlementAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F766E",
  },
  groupInfo: {
    padding: 18,
    backgroundColor: "#E3E8EF", // Lightened Header
    borderRadius: 8,
    marginBottom: 20,
    minHeight: 100,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  mandatory: {
    alignItems: "flex-start",
    gap: 5,
  },
  optional: {
    alignItems: "flex-end",
    gap: 5,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
  },
  groupDetails: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  optionalField: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  expenseTextContainer: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  expenseCategory: {
    fontSize: 12,
    color: "#6B7280",
  },
  expenseAmountContainer: {
    alignItems: "flex-end",
  },
  expenseDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  noExpensesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6B7280",
  },
  ////
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  
  remindButton: {
    flex: 1,
    backgroundColor: "#475569", // Slate Gray
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 6,
  },
  
  
  settleButton: {
    flex: 1,
    backgroundColor: "#047857", // Deep emerald green
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 6,
  },
  
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  

  
});
