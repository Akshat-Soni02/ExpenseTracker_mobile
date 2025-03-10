import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Control, Controller, useWatch } from "react-hook-form";
import CustomButton from "./button/CustomButton";
import { useGetUserFriendsQuery } from "@/store/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  control: Control<any>;
  amount: number;
  setValue: (name: string, value: any) => void;
  title?: string;
  IncludePaidBy?: boolean;
}

const SplitWithSelector: React.FC<Props> = ({ control, setValue, amount, title, IncludePaidBy }) => {
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [splitAmounts, setSplitAmounts] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [paidByModalVisible, setPaidByModalVisible] = useState(false);
  const [paidBy, setPaidBy] = useState<any>(null);

  const { data, isLoading } = useGetUserFriendsQuery();
  const splitWith = useWatch({ control, name: "splitWith" });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          const defaultUser = { user_id: user._id, name: user.name, profile_photo: user.profile_photo?.url };

          setSelectedUsers([defaultUser]);
          setPaidBy(defaultUser);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (selectedUsers.length > 0) {
      const equalSplit = (amount / selectedUsers.length).toFixed(2);
      const newSplits: Record<string, string> = {};

      selectedUsers.forEach((user) => {
        newSplits[user.user_id] = equalSplit;
      });

      setSplitAmounts(newSplits);

      setValue(
        "splitWith",
        selectedUsers.map((user) => ({
          user_id: user.user_id,
          amount: newSplits[user.user_id],
        }))
      );

      setValue("paidBy", paidBy);
    }
  }, [amount, selectedUsers]);

  const toggleUserSelection = (user: { _id: string; name: string }) => {
    let newSelectedUsers;

    if (selectedUsers.some((u) => u.user_id === user._id)) {
      newSelectedUsers = selectedUsers.filter((u) => u.user_id !== user._id);
    } else {
      newSelectedUsers = [...selectedUsers, { ...user, user_id: user._id }];
    }

    setSelectedUsers(newSelectedUsers);

    const updatedArray = newSelectedUsers.map((u) => ({
      user_id: u.user_id,
      amount: splitAmounts[u.user_id] || "0",
    }));
    setValue("splitWith", updatedArray);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || "Split with"}</Text>

      {/* Selected Users */}
      <View style={styles.selectedUsersContainer}>
        {selectedUsers.map((user) => (
          <View key={user.user_id} style={styles.splitItem}>
            <View style={styles.userIcon} />
            <Text style={styles.userName}>{user.name}</Text>
            <Controller
              control={control}
              render={({ field: { onChange } }) => (
                <TextInput
                  style={styles.amountInput}
                  value={splitAmounts[user.user_id]?.toString() || "0"}
                  onChangeText={(text) => {
                    const updatedSplits = { ...splitAmounts, [user.user_id]: text };
                    setSplitAmounts(updatedSplits);

                    setValue(
                      "splitWith",
                      selectedUsers.map((u) => ({
                        user_id: u.user_id,
                        amount: updatedSplits[u.user_id] || "0",
                      }))
                    );

                    onChange(text);
                  }}
                  keyboardType="numeric"
                />
              )}
              name={`splitAmount_${user.user_id}`}
              defaultValue={splitAmounts[user.user_id]?.toString() || "0"}
            />
          </View>
        ))}
      </View>

      {/* Add People Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add People</Text>
      </TouchableOpacity>

      {IncludePaidBy && (
        <View style={styles.paidByContainer}>
          <Text style={styles.paidByText}>Paid by</Text>
          <TouchableOpacity style={styles.paidByButton} onPress={() => setPaidByModalVisible(true)}>
            <Text style={styles.paidByButtonText}>{paidBy?.name || "Select Payer"}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* People Selection Modal */}
      <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTitle}>Select People</Text>
          <FlatList
            style={styles.list}
            data={data?.data?.map((user) => ({ ...user, user_id: user._id }))}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => {
              const isSelected = selectedUsers.some((u) => u.user_id === item.user_id);
              return (
                <TouchableOpacity onPress={() => toggleUserSelection(item)} style={[styles.modalItem, isSelected && styles.selectedItem]}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {isSelected && <Ionicons name="checkmark" size={20} color="black" />}
                </TouchableOpacity>
              );
            }}
          />
          <CustomButton onPress={() => setModalVisible(false)}>Done</CustomButton>
        </View>
      </Modal>

      {/* Paid By Selection Modal */}
      <Modal animationType="slide" transparent={false} visible={paidByModalVisible} onRequestClose={() => setPaidByModalVisible(false)}>
        <View style={styles.fullScreenModal}>
          <Text style={styles.modalTitle}>Select Payer</Text>
          <FlatList
            data={selectedUsers}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setPaidBy(item);
                  setValue("paidBy", item);
                  setPaidByModalVisible(false);
                }}
                style={[styles.modalItem, paidBy?.user_id === item.user_id && styles.selectedItem]}
              >
                <Text style={styles.modalItemText}>{item.name}</Text>
                {paidBy?.user_id === item.user_id && <Ionicons name="checkmark" size={20} color="black" />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SplitWithSelector;


const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(200, 230, 255, 0.4)",
    //  rgba(30, 42, 71, 0.9)
    borderRadius: 15,
    padding: 10,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
  selectedUsersContainer: {
    padding: 10,
    borderRadius: 10,
  },
  splitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2.5,
    backgroundColor: "rgba(200, 230, 255, 0.7)",
    padding: 10,
    borderRadius: 10,
  },
  userIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFD700",
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    color: "#000",
    flex: 1,
  },
  amountInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: 60,
    textAlign: "right",
    color: "#000",
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "rgb(56, 88, 114)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 18,
  },
  paidByContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    alignSelf: "center",
  },
  paidByText: {
    fontSize: 16,
    color: "#000",
  },
  paidByButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  paidByButtonText: {
    color: "#FFF",
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "rgba(200, 230, 255, 0.2)",
    marginVertical: 2,
    // padding: 6,
    paddingInline: 6,
    borderRadius: 5
    // borderBottomWidth: 1,
    // borderBottomColor: "#555",
  },
  list: {
    width: "100%"
  },
  modalItemText: {
    color: "#000",
    fontSize: 18,
  },
  selectedItem: {
    // fontWeight: "bold",
    backgroundColor: "rgba(111, 187, 250, 0.24)"

    // color: "#4CAF50",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#000",
    fontSize: 20,
  },
});