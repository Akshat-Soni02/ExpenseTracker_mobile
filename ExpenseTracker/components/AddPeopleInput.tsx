import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal , Image, TextInput} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Controller, Control } from "react-hook-form";
import CustomButton from "./button/CustomButton";
import { useGetUserFriendsQuery } from "@/store/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList } from "@shopify/flash-list";


interface Props {
  control: Control<any>;
  des?: string;
  update?: boolean;
}

const AddPeopleInput: React.FC<Props> = ({ control, des, update }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data, isLoading } = useGetUserFriendsQuery();
  const [user, setUser] = useState<{ user_id: string; name: string, profile_photo: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          // Ensure user is selected by default
          if (user && !selectedUsers.includes(user.user_id)) {
            onChange([user.user_id, ...selectedUsers]);
          }
        }, [user]);

        const toggleUserSelection = (userId: string) => {
          let newSelectedUsers;
          if (selectedUsers.includes(userId)) {
            newSelectedUsers = selectedUsers.filter((id) => id !== userId);
          } else {
            newSelectedUsers = [...selectedUsers, userId];
          }
          onChange(newSelectedUsers);
        };

        return (
          <View style={styles.container}>
            <Text style={styles.title}>Add People</Text>

            {/* Selected Users */}
            <View style={styles.selectedUsersContainer}>
              {selectedUsers.map((userId) => {
                const selectedUser = data?.data?.find((u) => u._id === userId) || 
                                     (user?.user_id === userId ? user : null);
                
                console.log("this is how user looks like", user);
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

              {/* Add People Button */}
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>{des || "Add People"}</Text>
              </TouchableOpacity>
            </View>


            {/* People Selection Modal */}
            {/* <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
              <View style={styles.fullScreenModal}>
                <Text style={styles.modalTitle}>Select People</Text>
                <FlatList
                  style={styles.list}
                  data={data?.data}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => {
                    const isSelected = selectedUsers.includes(item._id);
                    return (
                      <TouchableOpacity onPress={() => toggleUserSelection(item._id)} style={[styles.modalItem, isSelected && styles.selectedItem]}>
                        <Text style={styles.modalItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  }}
                />
                <CustomButton onPress={() => setModalVisible(false)}>Done</CustomButton>
              </View>
            </Modal> */}

            <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
              <View style={styles.fullScreenModal}>
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
                    <View style={{  height: 2, backgroundColor: 'white'}} />
                  )}
                />
                <CustomButton onPress={() => setModalVisible(false)}>Done</CustomButton>
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


// import React, { useState, useEffect } from "react";
// import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Image, FlatList } from "react-native";
// import { Control, Controller, useWatch } from "react-hook-form";
// import { useGetUserFriendsQuery } from "@/store/userApi";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { FlashList } from "@shopify/flash-list";
// import { LinearGradient } from "expo-linear-gradient";
// import CustomButton from "./button/CustomButton";
// import { Ionicons } from "@expo/vector-icons";

// interface Props {
//   control: Control<any>;
//   amount: number;
//   setValue: (name: string, value: any) => void;
//   title?: string;
//   IncludePaidBy?: boolean;
// }

// const SplitWithSelector: React.FC<Props> = ({ control, setValue, amount, title, IncludePaidBy }) => {
//   const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
//   const [splitAmounts, setSplitAmounts] = useState<Record<string, string>>({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [paidByModalVisible, setPaidByModalVisible] = useState(false);
//   const [paidBy, setPaidBy] = useState<any>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const { data, isLoading } = useGetUserFriendsQuery();
//   const splitWith = useWatch({ control, name: "splitWith" });

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const userData = await AsyncStorage.getItem("user");
//         if (userData) {
//           const user = JSON.parse(userData);
//           const defaultUser = { user_id: user._id, name: user.name, profile_photo: user.profile_photo?.url };
//           setSelectedUsers([defaultUser]);
//           setPaidBy(defaultUser);
//         }
//       } catch (error) {
//         console.error("Error loading user:", error);
//       }
//     };
//     loadUser();
//   }, []);

//   useEffect(() => {
//     if (selectedUsers.length > 0) {
//       const equalSplit = (amount / selectedUsers.length).toFixed(2);
//       const newSplits: Record<string, string> = {};
//       selectedUsers.forEach((user) => {
//         newSplits[user.user_id] = equalSplit;
//       });
//       setSplitAmounts(newSplits);
//       setValue(
//         "splitWith",
//         selectedUsers.map((user) => ({
//           user_id: user.user_id,
//           amount: newSplits[user.user_id],
//         }))
//       );
//       setValue("paidBy", paidBy);
//     }
//   }, [amount, selectedUsers]);

//   const toggleUserSelection = (user: { _id: string; name: string }) => {
//     let newSelectedUsers;
//     if (selectedUsers.some((u) => u.user_id === user._id)) {
//       newSelectedUsers = selectedUsers.filter((u) => u.user_id !== user._id);
//     } else {
//       newSelectedUsers = [...selectedUsers, { ...user, user_id: user._id }];
//     }
//     setSelectedUsers(newSelectedUsers);

//     const updatedArray = newSelectedUsers.map((u) => ({
//       user_id: u.user_id,
//       amount: splitAmounts[u.user_id] || "0",
//     }));
//     setValue("splitWith", updatedArray);
//   };

//   const filteredUsers = data?.data?.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{title || "Split with"}</Text>

//       <View style={styles.selectedUsersContainer}>
//         {selectedUsers.map((user) => (
//           <View key={user.user_id} style={styles.splitItem}>
//             {user.profile_photo ? (
//               <Image source={{ uri: user.profile_photo }} style={styles.userIcon} />
//             ) : (
//               <LinearGradient colors={["#D1D5DB", "#9CA3AF"]} style={styles.userIcon} />
//             )}
//             <Text style={styles.userName}>{user.name}</Text>
//             <Controller
//               control={control}
//               render={({ field: { onChange } }) => (
//                 <TextInput
//                   style={styles.amountInput}
//                   value={splitAmounts[user.user_id]?.toString() || "0"}
//                   onChangeText={(text) => {
//                     const updatedSplits = { ...splitAmounts, [user.user_id]: text };
//                     setSplitAmounts(updatedSplits);
//                     setValue(
//                       "splitWith",
//                       selectedUsers.map((u) => ({
//                         user_id: u.user_id,
//                         amount: updatedSplits[u.user_id] || "0",
//                       }))
//                     );
//                     onChange(text);
//                   }}
//                   keyboardType="numeric"
//                 />
//               )}
//               name={`splitAmount_${user.user_id}`}
//               defaultValue={splitAmounts[user.user_id]?.toString() || "0"}
//             />
//           </View>
//         ))}

//         <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//           <Text style={styles.addButtonText}>Add People</Text>
//         </TouchableOpacity>
//       </View>



//       {IncludePaidBy && (
//         <View style={styles.paidByContainer}>
//           <Text style={styles.paidByText}>Paid by</Text>
//           <TouchableOpacity style={styles.paidByButton} onPress={() => setPaidByModalVisible(true)}>
//             <Text style={styles.paidByButtonText}>{paidBy?.name || "Select Payer"}</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalContainer}>
//           <TextInput
//             placeholder="Search..."
//             style={styles.searchInput}
//             onChangeText={setSearchQuery}
//             value={searchQuery}
//           />
//           <FlashList
//             style = {styles.flashList}
//             data={filteredUsers}
//             keyExtractor={(item) => item._id}
//             estimatedItemSize={50}
//             renderItem={({ item }) => {
//               const isSelected = selectedUsers.some((u) => u.user_id === item._id);
//               return (
//                 <TouchableOpacity onPress={() => toggleUserSelection(item)} style={[styles.modalItem, isSelected && styles.selectedItem]}>
//                   <Text style={styles.modalItemText}>{item.name}</Text>
//                 </TouchableOpacity>
//               );
//             }}
//           />
//           <CustomButton onPress={() => setModalVisible(false)} style={styles.modalButton}>Done</CustomButton>
//         </View>
//       </Modal>

//       <Modal animationType="slide" transparent={false} visible={paidByModalVisible} onRequestClose={() => setPaidByModalVisible(false)}>
//          <View style={styles.fullScreenModal}>
//            <Text style={styles.modalTitle}>Select Payer</Text>
//           <FlatList
//             style = {styles.list}
//             data={selectedUsers}
//             keyExtractor={(item) => item.user_id}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => {
//                   setPaidBy(item);
//                   setValue("paidBy", item);
//                   setPaidByModalVisible(false);
//                 }}
//                 style={[styles.modalItem, paidBy?.user_id === item.user_id && styles.selectedItem]}
//               >
//                 <Text style={styles.modalItemText}>{item.name}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       </Modal>

//     </View>
//   );
// };

// export default SplitWithSelector;

// const styles = StyleSheet.create({
//   container: { padding: 10, borderRadius: 15, width: "100%", backgroundColor: "rgba(200, 230, 255, 0.4)" , borderWidth: 2, borderColor: "rgba(255, 255, 255, 0.2)",},
//   title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
//   userIcon: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
//   userName: { flex: 1, fontSize: 16 },
//   modalButton: {alignSelf: "center"},
//   list: {width: "100%"},
//   // flashList: {gap: 1},
//   selectedUsersContainer: { padding: 10, borderRadius: 10 },
//   splitItem: { flexDirection: "row", alignItems: "center", marginVertical: 5, padding: 10, borderRadius: 10, backgroundColor: "rgba(200, 230, 255, 0.7)" },
//   amountInput: { width: 60, padding: 5, textAlign: "center", backgroundColor: "#F3F4F6", borderRadius: 5, marginLeft: 10 },
//   addButton: { backgroundColor: "#355C7D", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
//   addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   modalContainer: { flex: 1, backgroundColor: "#fff", padding: 20,},
//   searchInput: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc", marginBottom: 10 },
//   modalItem: { paddingVertical: 15, flexDirection: "row", width: "100%", paddingHorizontal: 10 },
//   selectedItem: { backgroundColor: "rgba(111, 187, 250, 0.24)" },
//   modalItemText: { fontSize: 16 },
//     paidByContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 15,
//     alignSelf: "center",
//   },
//   paidByText: {
//     fontSize: 16,
//     color: "#000",
//   },
//   paidByButton: {
//     backgroundColor: "#333",
//     padding: 10,
//     borderRadius: 10,
//     marginLeft: 10,
//   },
//   paidByButtonText: {
//     color: "#FFF",
//   },
//     fullScreenModal: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 10,
//   },
// });
