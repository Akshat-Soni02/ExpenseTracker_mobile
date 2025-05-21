import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal , Image, TextInput, ActivityIndicator} from "react-native";
import { Controller, Control } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

import CustomButton from "../button/CustomButton";
import { useGetUserFriendsQuery } from "@/store/userApi";

interface Props {
  control: Control<any>;
  des?: string;
  update?: boolean;
}

export type people = {
  user_id: string;
  name: string;
  profile_photo?: string;
}

const AddPeopleInput: React.FC<Props> = ({ control, des }) => {

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [user, setUser] = useState< people | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMore, setShowMore] = useState<boolean>(false);

  const { data, isLoading, error: errorFriend } = useGetUserFriendsQuery();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({ user_id: parsedUser._id, name: parsedUser.name, profile_photo: parsedUser.profile_photo.url });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const filteredUsers = data?.data?.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  return (
    <Controller
      control={control}
      name="selectedUsers"
      defaultValue={user ? [user.user_id] : []}
      render={({ field: { value: selectedUsers, onChange } }) => {
        useEffect(() => {
          if (user && !selectedUsers.includes(user.user_id)) {
            onChange([user.user_id, ...selectedUsers]);
          }
        }, [user]);

        const toggleUserSelection = (userId: string) => {
          let newSelectedUsers;
          if (selectedUsers.includes(userId)) {
            newSelectedUsers = selectedUsers.filter((id: string) => id !== userId);
          } else {
            newSelectedUsers = [...selectedUsers, userId];
          }
          onChange(newSelectedUsers);
        };

        return (
          <View style={styles.container}>
            <View style = {styles.splitHead}>
              <View style={{ flex: 1 }} /> {/* Left spacer */}
              <Text style={styles.title}>Add People</Text>
              <View style={{ flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity onPress={() => setModalVisible(true)} disabled = {!!errorFriend}>
                  <Text style={{color: "#616161"}}>+ Add people</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.selectedUsersContainer}>
              {(showMore ? selectedUsers : selectedUsers.slice(0, 3)).map((userId: string) => {
                const selectedUser = data?.data?.find((u) => u._id === userId) || 
                                     (user?.user_id === userId ? user : null);
                
                return (
                  selectedUser && (
                    <View key={selectedUser.user_id} style={styles.splitItem}>
                      {selectedUser?.profile_photo ? (
                        <Image source={{ uri: selectedUser.profile_photo }} style={styles.userIcon} />
                      ) : (
                        <LinearGradient colors={["#D1D5DB", "#9CA3AF"]} style={styles.userIcon} />
                      )}
                      <Text style={styles.userName}>{selectedUser.name}</Text>
                    </View>
                  )
                );
              })}

              {selectedUsers.length > 3 && (
                <TouchableOpacity onPress={() => setShowMore(prev => !prev)}>
                  <Text style={{ color: "#616161" }}>
                    {showMore ? "Show less" : "Show all"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* if there is error querying friends then it will disable add button */}
              {/* <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)} disabled = {!!errorFriend}>
                <Text style={styles.addButtonText}>{des || "Add People"}</Text>
              </TouchableOpacity> */}
            </View>

            <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
              <View style={styles.fullScreenModal}>

              {isLoading ? (
                  <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>
                ) : (
                  <>
                    <TextInput
                      placeholder="Search..."
                      style={styles.searchInput}
                      onChangeText={setSearchQuery}
                      value={searchQuery}
                    />

                    <FlatList
                      style={styles.list}
                      data={filteredUsers}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => {
                        const isSelected = selectedUsers.includes(item._id);
                        return (
                          <TouchableOpacity onPress={() => toggleUserSelection(item._id)} style={[styles.modalItem, isSelected && styles.selectedItem]}>
                            <Text style={styles.modalItemText}>{item.name}</Text>
                          </TouchableOpacity>
                        );
                      }}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 2, backgroundColor: 'white' }} />
                      )}
                    />
                    <CustomButton onPress={() => setModalVisible(false)}>Done</CustomButton>
                  </>
                )}

              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
};

export default AddPeopleInput;

const styles = StyleSheet.create({
  container: { padding: 10, borderRadius: 15, width: "100%", backgroundColor: "rgba(200, 230, 255, 0.4)" , borderWidth: 2, borderColor: "rgba(255, 255, 255, 0.2)",},
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
  userIcon: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
  userName: { flex: 1, fontSize: 16 },
  splitHead: {flexDirection: "row", justifyContent: "center", alignItems: "center"},
  modalButton: {alignSelf: "center"},
  list: {width: "100%"},
  flashList: {},
  selectedUsersContainer: { padding: 10, borderRadius: 10 },
  splitItem: { flexDirection: "row", alignItems: "center", marginVertical: 5, padding: 10, borderRadius: 10, backgroundColor: "rgba(200, 230, 255, 0.7)" },
  amountInput: { width: 60, padding: 5, textAlign: "center", backgroundColor: "#F3F4F6", borderRadius: 5, marginLeft: 10 },
  addButton: { backgroundColor: "#355C7D", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, backgroundColor: "#fff", padding: 20,},
  searchInput: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 10, width: "100%" },
  modalItem: { paddingVertical: 15, flexDirection: "row", width: "100%", paddingHorizontal: 10 },
  selectedItem: { backgroundColor: "rgba(111, 187, 250, 0.24)" },
  modalItemText: { fontSize: 16 },
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
});