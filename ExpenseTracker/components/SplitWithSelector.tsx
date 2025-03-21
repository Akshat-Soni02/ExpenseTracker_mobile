import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Image, FlatList } from "react-native";
import { Control, Controller, useWatch ,useController} from "react-hook-form";
import { useGetUserFriendsQuery, useLazyGetUserByIdQuery } from "@/store/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "./button/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { useLazyGetGroupQuery } from "@/store/groupApi";

interface Props {
  control: Control<any>;
  amount: number;
  setValue: (name: string, value: any) => void;
  title?: string;
  group_id?: string;
  IncludePaidBy?: boolean;
  edit?:boolean;
}

const SplitWithSelector: React.FC<Props> = ({ control, setValue, amount, title, group_id, IncludePaidBy,edit=false }) => {
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [splitAmounts, setSplitAmounts] = useState<Record<string, number>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [paidByModalVisible, setPaidByModalVisible] = useState(false);
  const [paidBy, setPaidBy] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupMembers, setGroupMembers] = useState<{ _id: string; name: string }[]>([]);
  const [fromMembers, setFromMembers] = useState<{ _id: string; name: string }[]>([]);

  const { data: userFriends, isLoading: friendsLoading } = useGetUserFriendsQuery();
  const [getGroup, { data: groupData }] = useLazyGetGroupQuery();
  const [getUserById, { data: creatorData }] = useLazyGetUserByIdQuery();

  const splitWith = useWatch({ control, name: "splitWith" });
  const { field } = useController({ control, name: "paidBy" });
  const paidByUser = field.value;  
  const [editMembers, setEditMembers] = useState<{ _id: string; name: string }[]>([]);
  
  
  const fetchEditMembers = async (memberIds: string[]) => {
    if (memberIds.length === 0) return;
    console.log("Member IDs before fetching:", memberIds); 

  if (!memberIds || memberIds.length === 0 || memberIds.includes(undefined)) {
    console.error("Invalid member IDs detected:", memberIds);
    return []; // Return an empty array if there are invalid IDs
  }
  
    try {
      const memberData = await Promise.all(memberIds.map((id) => getUserById(id).unwrap()));
  
      const newMembers = memberData.map((res:any, index:any) => ({
        user_id: memberIds[index],
        name: res?.data?.name || "Unknown",
      }));
  
      setEditMembers((prevMembers) => [...prevMembers, ...newMembers]);
      return newMembers;
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  const [members, setMembers] = useState<{ _id: string; name: string }[]>([]);

  const updateMembers = async (memberIds) => {
    const fetchedMembers = await fetchEditMembers(memberIds);
    console.log("FetchedMembers:",fetchedMembers);
    setMembers(fetchedMembers??[]); // Updates state, triggering a re-render
  };
  useEffect(() => {
    if(edit){
      const memberIds = splitWith.map((item: any) => item.user_id);
      if(IncludePaidBy){
        memberIds.push(paidByUser.user_id)
      };
      console.log("MemberIds",memberIds);
      updateMembers(memberIds);
      console.log("membersHere:",members);
    }
  }, []);

  useEffect(() => {
    console.log("Updated membersHere:", members);
    if (edit) {
      setSelectedUsers(members);
    }
  }, [members]);
  

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setLoggedInUserId(user._id);
          const defaultUser = { user_id: user._id, name: user.name, profile_photo: user.profile_photo?.url };
          if(edit){
            console.log("SelectedMembers:",members);
            setSelectedUsers(members);
            setSelectedUsers((prevUsers) => [...members, defaultUser]);
            console.log("SelectedUsers:",selectedUsers);
            setPaidBy(paidByUser);
          }
          else{
          setSelectedUsers([defaultUser]);
          setPaidBy(defaultUser);
          setValue("paidBy", defaultUser);
        }
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
      const newSplits: Record<string, number> = {};
      selectedUsers.forEach((user) => {
        newSplits[user.user_id] = equalSplit;
      });
      setSplitAmounts(newSplits);
      console.log("SelectedUSers",selectedUsers);
      setValue(
        "splitWith",
        selectedUsers.map((user) => ({
          user_id: user.user_id,
          amount: newSplits[user.user_id],
        }))
      );
    }
  }, [amount, selectedUsers]);

  useEffect(() => {
    const loadGroup = async () => {
      if (group_id) {
        try {
          const res = await getGroup(group_id).unwrap();
          if (res?.data?.members) {
            const memberIds = res.data.members.map((member) => member.member_id).filter((id) => id !== loggedInUserId);
            fetchGroupMembers(memberIds);
          }
        } catch (error) {
          console.error("Error loading group:", error);
        }
      }
    };

    loadGroup();
  }, [group_id, loggedInUserId]);

  const fetchGroupMembers = async (memberIds: string[]) => {
    if (!memberIds.length) return;

    try {
      const memberData = await Promise.all(memberIds.map((id) => getUserById(id).unwrap()));

      const newMembers = memberData.map((res, index) => ({
        _id: memberIds[index],
        name: res?.data?.name || "Unknown",
      }));

      setGroupMembers(newMembers);
      setFromMembers(newMembers);
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  useEffect(() => {
    if (group_id) {
      if (groupMembers.length > 0) {
        setFromMembers(groupMembers);
      }
    } else {
      setFromMembers(userFriends?.data || []);
    }
  }, [group_id, groupMembers, userFriends]);

  const [updateUI, setUpdateUI] = useState(false);

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
    setUpdateUI((prev) => !prev);
  };
  

  const filteredUsers = React.useMemo(() => {
    return fromMembers?.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  }, [fromMembers, searchQuery]);
  

  console.log("filteredUsers: ",filteredUsers);
  console.log("groupMembers: ", groupMembers);
  console.log(groupData?.data?.members);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title || "Split with"}</Text>

      <View style={styles.selectedUsersContainer}>
        {selectedUsers.map((user) => (
          <View key={user.user_id} style={styles.splitItem}>
            {user.profile_photo ? (
              <Image source={{ uri: user.profile_photo }} style={styles.userIcon} />
            ) : (
              <LinearGradient colors={["#D1D5DB", "#9CA3AF"]} style={styles.userIcon} />
            )}
            <Text style={styles.userName}>{user.name}</Text>
            <Controller
              control={control}
              render={({ field: { onChange } }) => (
                <TextInput
                  style={styles.amountInput}
                  value={splitAmounts[user.user_id]?.toString() || "0"}
                  onChangeText={(text) => {
                    const numericValue = parseFloat(text) || 0; // Convert input to number
                    const updatedSplits = { ...splitAmounts, [user.user_id]: numericValue };
                    setSplitAmounts(updatedSplits);
                    setValue(
                      "splitWith",
                      selectedUsers.map((u) => ({
                        user_id: u.user_id,
                        amount: updatedSplits[u.user_id],
                      }))
                    );
                    onChange(numericValue);
                  }}                  
                  keyboardType="numeric"
                />
              )}
              name={`splitAmount_${user.user_id}`}
              defaultValue={splitAmounts[user.user_id] || 0}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Add People</Text>
        </TouchableOpacity>
      </View>



      {IncludePaidBy && (
        <View style={styles.paidByContainer}>
          <Text style={styles.paidByText}>Paid by</Text>
          <TouchableOpacity style={styles.paidByButton} onPress={() => setPaidByModalVisible(true)}>
            <Text style={styles.paidByButtonText}>{paidBy?.name || "Select Payer"}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <FlashList
            style = {styles.flashList}
            data={filteredUsers}
            keyExtractor={(item) => item._id}
            estimatedItemSize={50}
            extraData={updateUI}
            renderItem={({ item }) => {
              const isSelected = selectedUsers.some((u) => u.user_id === item._id);
              return (
                <TouchableOpacity onPress={() => toggleUserSelection(item)} style={[styles.modalItem, isSelected && styles.selectedItem]}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
          <CustomButton onPress={() => setModalVisible(false)} style={styles.modalButton}>Done</CustomButton>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={false} visible={paidByModalVisible} onRequestClose={() => setPaidByModalVisible(false)}>
         <View style={styles.fullScreenModal}>
           <Text style={styles.modalTitle}>Select Payer</Text>
          <FlatList
            style = {styles.list}
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
  container: { padding: 10, borderRadius: 15, width: "100%", backgroundColor: "rgba(200, 230, 255, 0.4)" , borderWidth: 2, borderColor: "rgba(255, 255, 255, 0.2)",},
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
  userIcon: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
  userName: { flex: 1, fontSize: 16 },
  modalButton: {alignSelf: "center"},
  list: {width: "100%"},
  // flashList: {gap: 1},
  selectedUsersContainer: { padding: 10, borderRadius: 10 },
  splitItem: { flexDirection: "row", alignItems: "center", marginVertical: 5, padding: 10, borderRadius: 10, backgroundColor: "rgba(200, 230, 255, 0.7)" },
  amountInput: { width: 60, padding: 5, textAlign: "center", backgroundColor: "#F3F4F6", borderRadius: 5, marginLeft: 10 },
  addButton: { backgroundColor: "#355C7D", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
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
