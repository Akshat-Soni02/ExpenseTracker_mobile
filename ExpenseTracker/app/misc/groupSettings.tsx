import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import SettingsRow from "@/components/readComponents/SettingsRow";
import Header from "@/components/Header";
import Octicons from '@expo/vector-icons/Octicons';
import { useSimplifyDebtsMutation, useAddPeopleInGroupMutation, useRemindAllGroupBorrowersMutation, useLazyLeaveGroupQuery } from "@/store/groupApi";
import { useGetUserFriendsQuery } from "@/store/userApi";
import CustomButton from "@/components/button/CustomButton";
import CustomSnackBar from "@/components/CustomSnackBar";

const GroupSettingsScreen = () => {
  const [budgetNotifyPercent, setBudgetNotifyPercent] = useState(80);
  const [state, setState] = React.useState({ open: false });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fromMembers, setFromMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [updateUI, setUpdateUI] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [snackMess, setSnackMess] = useState<string>("");

  const {id, budget, members} = useLocalSearchParams() as {id: string, budget?: string, members: string};
  const [simplifyDebts, {isLoading: loadingSimplify}] = useSimplifyDebtsMutation();
  const [addPeople, {isLoading: loadingAddPeople}] = useAddPeopleInGroupMutation();
  const [remindAll, {isLoading: loadingBorrowReq}] = useRemindAllGroupBorrowersMutation();
  const [leaveGroup, { isFetching, error:leaveError }] = useLazyLeaveGroupQuery();
  const { data: friends, isLoading: loadingFriends, error: errorFriend } = useGetUserFriendsQuery();

    let groupMembers = null;
    try {
        groupMembers = members ? JSON.parse(members) : null;
    } catch (e) {
        console.error("Invalid member JSON:", e);
    }

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
                if(groupMembers?.find((member) => member.member_id === friend._id)) return;
                else toAdd.push(friend);
                })
                setFromMembers(toAdd);
            }
        }
    }, [friends]);
  
    const filteredUsers = React.useMemo(() => {
        return fromMembers?.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
    }, [fromMembers, searchQuery]);
  
  
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
        setSnackMess("Reminders sent");
        setVisible(true);
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
         setSnackMess("Group left successfully");
         setVisible(true);
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

    const onSimplifyDebts = async () => {
        try {
            await simplifyDebts(id).unwrap();
            console.log("Successfully simplified debts");
            setSnackMess("Done! Group balances have been simplified.");
            setVisible(true);
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

    const handleAddPeople = async () => {
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
            setSnackMess("New members added to the group!");
            setVisible(true);
        } catch (err) {
            console.error("Error adding to group:", err);
        }
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header headerText="Group Settings"/>
      {/* GENERAL */}
      <Text style={styles.sectionTitle}>General</Text>
      {/* <SettingsRow
        icon={<Feather name="type" size={18} color="#6B7280" />}
        label="Title"
        editable
        value={title}
        onChangeText={setTitle}
        editing={editingField === "title"}
        onPress={() => setEditingField(editingField === "title" ? null : "title")}
      />
      <SettingsRow
        icon={<MaterialIcons name="attach-money" size={18} color="#6B7280" />}
        label="Estimated Budget"
        editable
        value={budget}
        onChangeText={setBudget}
        keyboardType="numeric"
        editing={editingField === "budget"}
        onPress={() => setEditingField(editingField === "budget" ? null : "budget")}
      />
      <SettingsRow
        icon={<FontAwesome name="calendar" size={18} color="#6B7280" />}
        label="Settle-up Date"
        value={settleDate.toDateString()}
        onPress={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={settleDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )} */}
      <SettingsRow
        icon={<MaterialCommunityIcons name="square-edit-outline" size={18} color="#6B7280" />}
        label="Edit Group"
        onPress={() => router.push({pathname: "/action/edit/editGroup", params: {id}})}
      />

      {/* PREFERENCES */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      {budget &&
      <SettingsRow
        icon={<Feather name="bell" size={18} color="#6B7280" />}
        label="Notify all when budget reaches"
        value={`${budgetNotifyPercent}%`}
        onPress={() => {
          const options = [50, 60, 70, 80, 90, 100];
          const nextIndex = (options.indexOf(budgetNotifyPercent) + 1) % options.length;
          setBudgetNotifyPercent(options[nextIndex]);
        }}
      />}
      <SettingsRow
        icon={<Feather name="shuffle" size={18} color="#6B7280" />}
        label="Simplify Debts"
        onPress={() => Alert.alert(
            "Simplify Debts",
            "This will reduce the number of payments between group members by adjusting who owes whom. It's a helpful way to make settling up easier.\n\nThis action can't be undone. Do you still want to continue?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Yes, Simplify", onPress: () => onSimplifyDebts()}
            ]
          )}
      />

      {/* ACTIONS */}
      <Text style={styles.sectionTitle}>Actions</Text>
      <SettingsRow
        icon={<Octicons name="person-add" size={18} color="#6B7280" />}
        label="Add People"
        onPress={() => setModalVisible(true)}
      />
      <SettingsRow
        icon={<MaterialIcons name="notifications-active" size={18} color="#6B7280" />}
        label="Remind All"
        onPress={() =>Alert.alert(
            "Send Reminder to All",
            "This will send a reminder email to everyone who owes you in this group. Do you want to continue?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Yes, Send", onPress: () => handleRemindAll() }
            ]
          )}
      />
      <SettingsRow
        icon={<MaterialIcons name="exit-to-app" size={18} color="#EF4444" />}
        label="Leave Group"
        danger
        onPress={() => Alert.alert(
            "Leave Group",
            "Are you sure you want to leave this group? This action cannot be undone.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Yes, Leave", style: "destructive", onPress: () => handleLeaveGroup() }
            ]
          )}
      />
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
        <CustomSnackBar
            message={snackMess}
            visible={visible}
            onDismiss={() => setVisible(false)}
        />
    </ScrollView>
  );
};

export default GroupSettingsScreen;

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: "#FFFFFF",
      flex: 1
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "#9CA3AF",
      marginTop: 24,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
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
  });
  
